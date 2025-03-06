import { colors } from "./colors";

type AuraShape = "CIRCLE" | "SQUARE";

export type ToolMetadata = {
  radius: number;
  opacity: number;
  color: string;
  shape: AuraShape;
};

export function isToolMetadata(value: unknown): value is ToolMetadata {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  if (typeof (value as ToolMetadata)?.radius !== "number") return false;
  if (typeof (value as ToolMetadata)?.opacity !== "number") return false;
  if (typeof (value as ToolMetadata)?.color !== "string") return false;
  if (typeof (value as ToolMetadata)?.shape !== "string") return false;
  return true;
}

export const defaultToolMetadata: ToolMetadata = {
  radius: 3,
  opacity: 20,
  color: colors[0],
  shape: "CIRCLE",
};
