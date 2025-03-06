import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OBR_MOVE_TOOL_ID, POPOVER_ID, TOOL_ID } from "./ids";
import OBR, { Image, Math2 } from "@owlbear-rodeo/sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addThemeToBody(themeMode?: "DARK" | "LIGHT") {
  if (themeMode === undefined)
    themeMode = new URLSearchParams(document.location.search).get(
      "themeMode",
    ) as "DARK" | "LIGHT";
  if (themeMode === "DARK") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
}

export function switchToDefaultTool() {
  OBR.tool.activateTool(OBR_MOVE_TOOL_ID);
}

export function getImageBounds(item: Image, sceneDpi: number) {
  const dpiScale = sceneDpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
}

export function getImageCenter(image: Image, sceneDpi: number) {
  // Image center with respect to image center
  let imageCenter = { x: 0, y: 0 };

  // Find image center with respect to image top left corner
  imageCenter = Math2.add(
    imageCenter,
    Math2.multiply(
      {
        x: image.image.width,
        y: image.image.height,
      },
      0.5,
    ),
  );

  // Find image center with respect to item position
  imageCenter = Math2.subtract(imageCenter, image.grid.offset);
  imageCenter = Math2.multiply(imageCenter, sceneDpi / image.grid.dpi); // scale switch from image to scene
  imageCenter = Math2.multiply(imageCenter, image.scale);
  imageCenter = Math2.rotate(imageCenter, { x: 0, y: 0 }, image.rotation);

  // find image center with respect to world
  imageCenter = Math2.add(imageCenter, image.position);

  return imageCenter;
}

export async function createPopover() {
  OBR.popover.open({
    id: POPOVER_ID,
    url: `/src/menu/menu.html?themeMode=${(await OBR.theme.getTheme()).mode}`,
    width: 282,
    height: 270,
    anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
    anchorElementId: TOOL_ID,
    disableClickAway: true,
  });
}

export function closePopover() {
  OBR.popover.close(POPOVER_ID);
}
