import OBR, { buildShape, isImage, Image } from "@owlbear-rodeo/sdk";
import { TOOL_ID, MODE_ID, POPOVER_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata } from "../types";
export const icon = new URL(
  "../assets/sun.svg#icon",
  import.meta.url,
).toString();

OBR.onReady(async () => {
  printVersionToConsole();
  start();
});

async function printVersionToConsole() {
  fetch("/manifest.json")
    .then((response) => response.json())
    .then((json) =>
      console.log(json["name"] + " - version: " + json["version"]),
    );
}

async function start() {
  createTool();
  createMode();
  handleActiveToolChange();
}

function handleActiveToolChange() {
  OBR.tool.onToolChange((id) => {
    if (id === TOOL_ID) createPopover();
    else closePopover();
  });
}

function createTool() {
  OBR.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: icon,
        label: "Auras",
      },
    ],
    defaultMetadata: defaultToolMetadata,
  });
}

function createMode() {
  OBR.tool.createMode({
    id: MODE_ID,
    icons: [
      {
        icon: icon,
        label: "Auras Applicator",
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
        const { width } = getImageBounds(target, sceneDpi);
        const metadata = await OBR.tool.getMetadata(TOOL_ID);
        if (!isToolMetadata(metadata)) throw "Error bad metadata";
        const aura = buildShape()
          .id(`${target.id}-aura`)
          .shapeType("CIRCLE")
          .position(target.position)
          .attachedTo(target.id)
          .width(width + sceneDpi * metadata.radius * 2)
          .height(width + sceneDpi * metadata.radius * 2)
          .fillColor(metadata.color)
          .fillOpacity(metadata.opacity / 100)
          .strokeWidth(0)
          .locked(true)
          .disableAttachmentBehavior(["SCALE"])
          .build();
        OBR.scene.items.addItems([aura]);
      }
    },
    preventDrag: {
      target: [
        { key: "locked", value: true, operator: "!=", coordinator: "||" },
        { key: "image", value: undefined, operator: "!=" },
        {
          key: "layer",
          value: "CHARACTER",
          operator: "!=",
        },
        {
          key: "layer",
          value: "PROP",
          operator: "!=",
        },
        { key: "layer", value: "MOUNT", operator: "!=" },
      ],
      // dragging: true,
    },
  });
}

function createPopover() {
  OBR.popover.open({
    id: POPOVER_ID,
    url: "/",
    width: 282,
    height: 200,
    anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
    disableClickAway: true,
  });
}

function closePopover() {
  OBR.popover.close(POPOVER_ID);
}

function getImageBounds(item: Image, dpi: number) {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
}
