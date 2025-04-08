export type ToolMetadata = {
  condition: string;
  conditionLibraryName: string;
  customConditions: string[];
  customConditionLibraries: ConditionLibrary[];
  enabledCustomConditionLibraries: string[];
};

export interface ConditionLibrary {
  name: string;
  conditionTree: ConditionTree;
}

export interface ConditionTree {
  [string: string]: ConditionTree;
}

export function isToolMetadata(value: unknown): value is ToolMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;

  const toolMetadata = value as ToolMetadata;
  if (typeof toolMetadata?.condition !== "string") return false;
  if (typeof toolMetadata?.conditionLibraryName !== "string") return false;
  if (!Array.isArray(toolMetadata?.customConditions)) return false;
  if (!Array.isArray(toolMetadata?.customConditionLibraries)) return false;
  if (!Array.isArray(toolMetadata?.enabledCustomConditionLibraries))
    return false;

  return true;
}

export const defaultToolMetadata: ToolMetadata = {
  condition: "",
  conditionLibraryName: "Draw Steel with Emojis",
  customConditions: [],
  customConditionLibraries: [],
  enabledCustomConditionLibraries: [],
};
