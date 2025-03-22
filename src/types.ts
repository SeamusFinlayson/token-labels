import { ConditionLibraryName } from "./menu/conditionsTree";

export type ToolMetadata = {
  condition: string;
  conditionLibrary: ConditionLibraryName;
};

export function isToolMetadata(value: unknown): value is ToolMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  if (typeof (value as ToolMetadata)?.condition !== "string") return false;
  if (typeof (value as ToolMetadata)?.conditionLibrary !== "string")
    return false;
  return true;
}

export const defaultToolMetadata: ToolMetadata = {
  condition: "",
  conditionLibrary: "drawSteelWithEmojis",
};
