import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OBR_MOVE_TOOL_ID, POPOVER_ID, TOOL_ID } from "./ids";
import OBR, { Image } from "@owlbear-rodeo/sdk";

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

export function getImageBounds(item: Image, dpi: number) {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
}

export async function createPopover() {
  OBR.popover.open({
    id: POPOVER_ID,
    url: `/src/menu/menu.html?themeMode=${(await OBR.theme.getTheme()).mode}`,
    width: 282,
    height: 236,
    anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
    anchorElementId: TOOL_ID,
    disableClickAway: true,
  });
}

export function closePopover() {
  OBR.popover.close(POPOVER_ID);
}
