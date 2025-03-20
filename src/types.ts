export type ToolMetadata = {
  condition: string;
};

export function isToolMetadata(value: unknown): value is ToolMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  if (typeof (value as ToolMetadata)?.condition !== "string") return false;
  return true;
}

export const defaultToolMetadata: ToolMetadata = {
  condition: "",
};
