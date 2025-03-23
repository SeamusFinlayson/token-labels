import { ConditionLibraryName } from "./menu/conditionsTree";

export type ToolMetadata = {
  condition: string;
  conditionLibrary: ConditionLibraryName;
  customConditions: string[];
};

export function isToolMetadata(value: unknown): value is ToolMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  if (typeof (value as ToolMetadata)?.condition !== "string") return false;
  if (typeof (value as ToolMetadata)?.conditionLibrary !== "string")
    return false;
  if (!Array.isArray((value as ToolMetadata)?.customConditions)) return false;
  return true;
}

export const defaultToolMetadata: ToolMetadata = {
  condition: "",
  conditionLibrary: "drawSteelWithEmojis",
  customConditions: [],
};
