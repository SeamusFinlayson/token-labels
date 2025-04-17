import OBR, {
  AttachmentBehavior,
  buildLabel,
  isImage,
  Item,
  Math2,
  Vector2,
} from "@owlbear-rodeo/sdk";
import { TOOL_ID, MODE_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";
import {
  closePopover,
  openPopover as openPopover,
  getImageBounds,
  switchToDefaultTool,
} from "../utils";

export const icon = new URL(
  "../assets/tags.svg#icon",
  import.meta.url,
).toString();

// Constants used in multiple functions
const FONT_SIZE = 22;
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

export function createTool() {
  OBR.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: icon,
        label: "Condition Labels",
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

        const metadata = await OBR.tool.getMetadata(TOOL_ID);
        const toolMetadata = { ...defaultToolMetadata, ...metadata };
        if (!isToolMetadata(toolMetadata)) throw "Error bad metadata";

        const attachments = await OBR.scene.items.getItemAttachments([
          target.id,
        ]);
        const labelAttachments: Item[] = [];
        let index = 0;
        for (const attachment of attachments) {
          if (attachment.id.startsWith(`${target.id}-label`)) {
            attachment.position = getLabelPosition(
              target.position,
              width,
              height,
              index,
            );
            index++;
            labelAttachments.push(attachment);
          }
        }

        if (toolMetadata.condition === "") {
          OBR.scene.items.addItems([...labelAttachments]);
          return;
        }

        const conditionLabel = buildLabel()
          .maxViewScale(0.8)
          .minViewScale(0.8)
          .position(getLabelPosition(target.position, width, height, index))
          .plainText(toolMetadata.condition)
          .fontSize(FONT_SIZE)
          .fontFamily(FONT)
          .fontWeight(400)
          .pointerHeight(0)
          .pointerDirection("LEFT")
          .attachedTo(target.id)
          .fillOpacity(0.87)
          .layer("TEXT")
          .cornerRadius(sceneDpi / 12)
          .padding(sceneDpi / 50)
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
      OBR.tool.setMetadata(TOOL_ID, { condition: "" } as ToolMetadata);
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
  width: number,
  height: number,
  index: number,
): Vector2 {
  if (index === 0)
    return Math2.add(targetPosition, {
      x: -width / 2,
      y: -height / 2 + 20,
    });
  if (index === 1)
    return Math2.add(targetPosition, {
      x: -width / 2,
      y: -height / 2 + 20 - -1 * 35,
    });
  return Math2.add(targetPosition, {
    x: -width / 2,
    y: -height / 2 + 20 - (index - 1) * 35,
  });
}
