export type PositioningSettings = {
  horizontalOffset: number;
  verticalOffset: number;
  verticalSpacing: number;
  scale: number;
  alignment: "LEFT" | "CENTER" | "RIGHT";
  justification: "TOP" | "CENTER" | "BOTTOM";
  pointerDirection: "UP" | "DOWN" | "LEFT" | "RIGHT";
};

export type ToolMetadata = {
  condition: string;

  conditionLibraryName: string;
  customConditions: string[];
  customConditionLibraries: ConditionLibrary[];
  enabledCustomConditionLibraries: string[];
} & PositioningSettings;

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

export const defaultPositioningSettings: PositioningSettings = {
  horizontalOffset: 0,
  verticalOffset: 15,
  verticalSpacing: 35,
  scale: 1,
  alignment: "LEFT",
  justification: "TOP",
  pointerDirection: "LEFT",
};

export const defaultToolMetadata: ToolMetadata = {
  condition: "",

  conditionLibraryName: "none",
  customConditions: [],
  customConditionLibraries: [],
  enabledCustomConditionLibraries: [],

  ...defaultPositioningSettings,
};

export type SharingMetadata = {
  isHost: boolean;
  timeStamp: number;
  sharedDefaultLibrary: boolean;
  sharedCustomLibraries: boolean;
  sharedCustomConditions: boolean;
  sharedPositioningSettings: boolean;
};

export function isSharingMetadata(value: unknown): value is SharingMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;

  const sharingMetadata = value as SharingMetadata;
  if (typeof sharingMetadata?.isHost !== "boolean") return false;
  if (typeof sharingMetadata?.timeStamp !== "number") return false;
  if (typeof sharingMetadata?.sharedDefaultLibrary !== "boolean") return false;
  if (typeof sharingMetadata?.sharedCustomLibraries !== "boolean") return false;
  if (typeof sharingMetadata?.sharedCustomConditions !== "boolean")
    return false;

  return true;
}

export const defaultSharingMetadata: SharingMetadata = {
  timeStamp: 0,
  isHost: false,
  sharedDefaultLibrary: false,
  sharedCustomLibraries: false,
  sharedCustomConditions: false,
  sharedPositioningSettings: false,
};

export type ShareMessage = {
  timeStamp: number;
  sharedDefaultLibrary: boolean;
  sharedCustomLibraries: boolean;
  sharedCustomConditions: boolean;
  sharedPositioningSettings: boolean;
  conditionLibraryName: string;
  customConditions: string[];
  customConditionLibraries: ConditionLibrary[];
  enabledCustomConditionLibraries: string[];
} & PositioningSettings;
