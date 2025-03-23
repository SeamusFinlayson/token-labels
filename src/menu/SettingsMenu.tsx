import { Button } from "../components/Button";
import { ScrollArea } from "../components/scrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { ConditionLibraryName } from "../types";

export function SettingsMenu({
  conditionLibrary,
  setConditionLibrary,
  customConditions,
  setCustomConditions,
}: {
  conditionLibrary: ConditionLibraryName;
  setConditionLibrary: (conditionLibrary: ConditionLibraryName) => void;
  customConditions: string[];
  setCustomConditions: (customConditions: string[]) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <ScrollArea>
        <div className="space-y-3 p-3">
          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Condition Library
          </div>
          <Select
            value={conditionLibrary}
            onValueChange={(value) => {
              setConditionLibrary(value as ConditionLibraryName);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Condition Library" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"drawSteel" satisfies ConditionLibraryName}>
                Draw Steel
              </SelectItem>
              <SelectItem
                value={"drawSteelWithEmojis" satisfies ConditionLibraryName}
              >
                Draw Steel with Emojis
              </SelectItem>
              <SelectItem
                value={"drawSteelEmojisOptional" satisfies ConditionLibraryName}
              >
                Draw Steel with Optional Emojis
              </SelectItem>
              <SelectItem value={"dnd" satisfies ConditionLibraryName}>
                Dungeons & Dragons
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Custom Conditions (click to delete)
          </div>
          <div className="flex flex-wrap gap-2">
            {customConditions.length === 0
              ? "You have no custom conditions."
              : customConditions.map((condition) => (
                  <Button
                    onClick={() => {
                      setCustomConditions(
                        customConditions.filter((val) => val !== condition),
                      );
                    }}
                  >
                    {condition}
                  </Button>
                ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
