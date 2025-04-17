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
  conditionLibraryName: "None",
  customConditions: [],
  customConditionLibraries: [],
  enabledCustomConditionLibraries: [],
};

export type SharingMetadata = {
  timeStamp: number;
  isHost: boolean;
  shareDefaultLibrary: boolean;
  shareCustomLibraries: boolean;
  shareCustomConditions: boolean;
};

export function isSharingMetadata(value: unknown): value is SharingMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;

  const sharingMetadata = value as SharingMetadata;
  if (typeof sharingMetadata?.timeStamp !== "number") return false;
  if (typeof sharingMetadata?.shareDefaultLibrary !== "boolean") return false;
  if (typeof sharingMetadata?.shareCustomLibraries !== "boolean") return false;
  if (typeof sharingMetadata?.shareCustomConditions !== "boolean") return false;
  if (typeof sharingMetadata?.isHost !== "boolean") return false;

  return true;
}

export const defaultSharingMetadata: SharingMetadata = {
  timeStamp: 0,
  isHost: false,
  shareDefaultLibrary: false,
  shareCustomLibraries: false,
  shareCustomConditions: false,
};

export type ShareMessage = {
  timeStamp: number;
  shareDefaultLibrary: boolean;
  shareCustomLibraries: boolean;
  shareCustomConditions: boolean;
  conditionLibraryName: string;
  customConditions: string[];
  customConditionLibraries: ConditionLibrary[];
  enabledCustomConditionLibraries: string[];
};
