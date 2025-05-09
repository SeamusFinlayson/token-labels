import OBR, {
  AttachmentBehavior,
  buildLabel,
  isImage,
  isLabel,
  Item,
  Math2,
  Vector2,
} from "@owlbear-rodeo/sdk";
import { TOOL_ID, MODE_ID } from "../ids";
import { defaultToolMetadata, ToolMetadata } from "../types";
import {
  closePopover,
  openPopover as openPopover,
  getImageBounds,
  switchToDefaultTool,
  getToolMetadata,
  writeToolMetadata,
} from "../utils";

export const icon = new URL(
  "../assets/tags.svg#icon",
  import.meta.url,
).toString();

// Constants used in multiple functions
const FONT_SIZE = 16;
const FONT = "Roboto, sans-serif";
const LOCKED = false;
const DISABLE_HIT = false;
const BACKGROUND_OPACITY = 0.9;
const DISABLE_ATTACHMENT_BEHAVIORS: AttachmentBehavior[] = [
  "ROTATION",
  "VISIBLE",
  "COPY",
  "SCALE",
  // "POSITION",
];

let lastNotificationId = "";

export function createTool() {
  OBR.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: icon,
        label: "Label",
      },
    ],
    onClick: () => {
      openPopover();
      return true;
    },
    defaultMetadata: defaultToolMetadata,
  });
}

export function createMode() {
  OBR.tool.createMode({
    id: MODE_ID,
    icons: [
      {
        icon: icon,
        label: "Condition Label Applicator",
        filter: {
          activeTools: [TOOL_ID],
        },
      },
    ],
    cursors: [
      {
        cursor: "pointer",
        filter: {
          target: [
            {
              key: "layer",
              value: "CHARACTER",
              operator: "==",
              coordinator: "||",
            },
            {
              key: "layer",
              value: "PROP",
              operator: "==",
              coordinator: "||",
            },
            { key: "layer", value: "MOUNT", operator: "==" },
            { key: "locked", value: true, operator: "!=" },
            { key: "image", value: undefined, operator: "!=" },
          ],
        },
      },
      {
        cursor: "move",
      },
    ],
    onToolClick: async (_context, event) => {
      const target = event?.target;
      if (
        target &&
        isImage(target) &&
        target.locked === false &&
        (target.layer === "CHARACTER" ||
          target.layer === "MOUNT" ||
          target.layer === "PROP")
      ) {
        const sceneDpi = await OBR.scene.grid.getDpi();
        const { width, height } = getImageBounds(target, sceneDpi);

        const toolMetadata = getToolMetadata();

        const attachments = await OBR.scene.items.getItemAttachments([
          target.id,
        ]);
        const labelAttachments: Item[] = [];
        let index = 0;
        for (const attachment of attachments) {
          if (
            attachment.id.startsWith(`${target.id}-label`) &&
            isLabel(attachment)
          ) {
            attachment.position = getLabelPosition(
              target.position,
              index,
              width,
              height,
              toolMetadata,
            );
            attachment.style = {
              ...attachment.style,
              pointerDirection: toolMetadata.pointerDirection,
              minViewScale: toolMetadata.scale,
              maxViewScale: toolMetadata.scale,
            };
            index++;
            labelAttachments.push(attachment);
          }
        }

        if (toolMetadata.condition === "") {
          OBR.scene.items.addItems([...labelAttachments]);
          if (lastNotificationId !== "")
            OBR.notification.close(lastNotificationId);
          lastNotificationId = await OBR.notification.show(
            `${index} label${index === 1 ? "" : "s"} reorganized.`,
          );
          return;
        }

        const conditionLabel = buildLabel()
          .maxViewScale(toolMetadata.scale)
          .minViewScale(toolMetadata.scale)
          .position(
            getLabelPosition(
              target.position,
              index,
              width,
              height,
              toolMetadata,
            ),
          )
          .plainText(toolMetadata.condition)
          .fontSize(FONT_SIZE)
          .fontFamily(FONT)
          .fontWeight(400)
          .pointerHeight(0)
          .pointerDirection(toolMetadata.pointerDirection)
          .attachedTo(target.id)
          .fillOpacity(0.87)
          .layer("TEXT")
          .cornerRadius((sceneDpi / 150) * 6)
          .padding((sceneDpi / 150) * 2)
          .backgroundOpacity(BACKGROUND_OPACITY)
          .locked(LOCKED)
          .metadata({})
          .id(getLabelId(target.id))
          .visible(target.visible)
          .disableAttachmentBehavior(DISABLE_ATTACHMENT_BEHAVIORS)
          .disableHit(DISABLE_HIT)
          .build();
        OBR.scene.items.addItems([...labelAttachments, conditionLabel]);
      } else return true;
    },
    preventDrag: {
      dragging: true,
    },
  });
}

export async function handleActiveTool() {
  if ((await OBR.tool.getActiveTool()) === TOOL_ID) openPopover();
  OBR.tool.onToolChange((id) => {
    if (id === TOOL_ID) openPopover();
    else {
      writeToolMetadata({ ...getToolMetadata(), condition: "" });
      closePopover();
    }
  });
}

export async function handleSceneClose() {
  if (!(await OBR.scene.isReady())) switchToDefaultTool();
  OBR.scene.onReadyChange((ready) => {
    if (!ready) switchToDefaultTool();
  });
}

function getLabelId(itemId: string): string {
  return `${itemId}-label-${Date.now()}`;
}

function getLabelPosition(
  targetPosition: Vector2,
  index: number,
  width: number,
  height: number,
  toolMetadata: ToolMetadata,
): Vector2 {
  const origin = Math2.add(targetPosition, {
    x: width * alignmentMultiplier[toolMetadata.alignment],
    y: height * justificationMultiplier[toolMetadata.justification],
  });

  if (index === 1) index = -1;
  else if (index > 1) index--;

  return Math2.add(origin, {
    x: toolMetadata.horizontalOffset,
    y: toolMetadata.verticalOffset - index * toolMetadata.verticalSpacing,
  });
}

const alignmentMultiplier = {
  ["LEFT"]: -0.5,
  ["CENTER"]: 0,
  ["RIGHT"]: 0.5,
};

const justificationMultiplier = {
  ["TOP"]: -0.5,
  ["CENTER"]: 0,
  ["BOTTOM"]: 0.5,
};
