import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OBR_MOVE_TOOL_ID, POPOVER_ID, SHARING_ID, TOOL_ID } from "./ids";
import OBR, { Image, Math2 } from "@owlbear-rodeo/sdk";
import {
  defaultSharingMetadata,
  defaultToolMetadata,
  isSharingMetadata,
  isToolMetadata,
  ShareMessage,
  SharingMetadata,
  ToolMetadata,
} from "./types";

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

export async function openPopover() {
  OBR.popover.open({
    id: POPOVER_ID,
    url: `/src/menu/menu.html?themeMode=${(await OBR.theme.getTheme()).mode}`,
    width: 400,
    height: 300,
    anchorOrigin: { horizontal: "CENTER", vertical: "TOP" },
    marginThreshold: 8,
    anchorElementId: TOOL_ID,
    disableClickAway: true,
    hidePaper: true,
  });
}

export function closePopover() {
  OBR.popover.close(POPOVER_ID);
}

export function setPopoverHeight(height: number) {
  OBR.popover.setHeight(POPOVER_ID, height);
}
export function setPopoverWidth(width: number) {
  OBR.popover.setWidth(POPOVER_ID, width);
}

export const getSharingMetadata = () => {
  const value = localStorage.getItem(SHARING_ID + OBR.room.id);
  if (value === null) return defaultSharingMetadata;
  const valueJson = JSON.parse(value);
  if (!isSharingMetadata(valueJson)) return defaultSharingMetadata;
  return valueJson;
};

export function writeSharingMetadata(sharingMetadata: SharingMetadata | null) {
  if (sharingMetadata === null)
    localStorage.removeItem(SHARING_ID + OBR.room.id);
  localStorage.setItem(
    SHARING_ID + OBR.room.id,
    JSON.stringify(sharingMetadata),
  );
}

export function getToolMetadata() {
  const value = localStorage.getItem(TOOL_ID + OBR.room.id);
  if (value === null) return defaultToolMetadata;
  const retrievedMetadata = { ...defaultToolMetadata, ...JSON.parse(value) };
  if (!isToolMetadata(retrievedMetadata)) return defaultToolMetadata;
  return retrievedMetadata;
}

export function writeToolMetadata(toolMetadata: ToolMetadata | null) {
  if (toolMetadata === null) localStorage.removeItem(TOOL_ID + OBR.room.id);
  localStorage.setItem(TOOL_ID + OBR.room.id, JSON.stringify(toolMetadata));
}

export const broadcastToolConfig = (
  sharingMetadata: SharingMetadata,
  toolMetadata: ToolMetadata,
) => {
  if (sharingMetadata.isHost) {
    OBR.broadcast.sendMessage(SHARING_ID, {
      timeStamp: sharingMetadata.timeStamp,
      sharedDefaultLibrary: sharingMetadata.sharedDefaultLibrary,
      sharedCustomLibraries: sharingMetadata.sharedCustomLibraries,
      sharedCustomConditions: sharingMetadata.sharedCustomConditions,
      conditionLibraryName: toolMetadata.conditionLibraryName,
      customConditions: toolMetadata.customConditions,
      customConditionLibraries: toolMetadata.customConditionLibraries,
      enabledCustomConditionLibraries:
        toolMetadata.enabledCustomConditionLibraries,
    } satisfies ShareMessage);
  }
};

export function parseStringForNumber(
  string: string,
  settings?: { min?: number; max?: number; fallback?: number },
): number {
  const newValue = parseFloat(string);
  if (Number.isNaN(newValue)) return settings?.fallback ? settings.fallback : 0;

  if (settings !== undefined) {
    if (settings.max !== undefined && newValue > settings.max)
      return settings.max;
    if (settings.min !== undefined && newValue < settings.min)
      return settings.min;
  }

  return newValue;
}
