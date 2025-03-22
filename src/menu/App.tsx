import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";
import {
  setPopoverHeight,
  setPopoverWidth,
  switchToDefaultTool,
} from "../utils";
import {
  ChevronDown,
  ChevronUp,
  Settings2,
  TextCursorInput,
  X,
} from "lucide-react";
import { ConditionLibraryName, conditions } from "./conditionsTree";
import { ConditionInput } from "./conditionInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

// const conditionHints = [
//   "Blinded",
//   "Charmed",
//   "Dead",
//   "Deafened",
//   "Dying",
//   "Frightened",
//   "Grappled",
//   "Incapacitated",
//   "Invisible",
//   "Paralyzed",
//   "Petrified",
//   "Poisoned",
//   "Prone",
//   "Restrained",
//   "Stunned",
//   "Stable",
//   "Unconscious",
//   "Exhaustion",
// ];

// const conditionHints = [
//   "Blind",
//   "Concentrating",
//   "Charmed",
//   "Deafened",
//   "Exhausted",
//   "Frightened",
//   "Grappled",
//   "Incapacitated",
//   "Invisible",
//   "Paralyzed",
//   "Petrified",
//   "Poisoned",
//   "Prone",
//   "Restrained",
//   "Stunned",
//   "Unconscious",
//   "Stabilized",
//   "Dead",
//   "Advantage",
//   "Baned",
//   "Bleeding Out",
//   "Blessed",
//   "Disadvantage",
//   "Dodge",
//   "Flying",
//   "Hasted",
//   "Hexblade's Curse",
//   "Hexed",
//   "Holding Action",
//   "Hunter's Mark",
//   "Inspired",
//   "Mage Armor",
//   "Raging",
//   "Reaction Used",
//   "Armor of Agathys",
//   "Blink",
//   "Blur",
//   "Confused",
//   "Insightful Fighting",
//   "Mirror Image",
//   "On Fire",
//   "Possessed",
//   "Sanctuary",
//   "Shield of Faith",
//   "Spirit Guardian",
//   "Summoning",
//   "Symbiotic Entity",
//   "Shifted",
//   "Truesight",
//   "Warding Bond",
//   "Ancestral Protectors",
//   "Cause of Fear",
//   "Compelled Duel",
//   "Divine Favor",
//   "Highlighted",
//   "Slayer's Prey",
//   "Shell Defense",
//   "Bear's Endurance",
//   "Bull's Strength",
//   "Cat's Grace",
//   "Eagle's Splendor",
//   "Fox's Cunning",
//   "Owl's Wisdom",
// ];

export function App() {
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>();
  useEffect(() => {
    OBR.tool.getMetadata(TOOL_ID).then((value) => {
      if (isToolMetadata(value)) {
        setToolMetadata(value);
        setInputValue(value.condition);
        setConditionLibrary(value.conditionLibrary);
      } else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata(toolMetadata);
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  const [conditionLibrary, setConditionLibrary] =
    useState<ConditionLibraryName>("drawSteel");
  const [isExpanded, setIsExpanded] = useState(true);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  if (toolMetadata === undefined)
    return <div className="bg-mirage-200 dark:bg-mirage-900/60 h-full" />;

  return (
    <div>
      <div className="flex justify-center pt-2">
        <div className="bg-mirage-900/50 flex gap-2 rounded-full backdrop-blur-2xl">
          {isExpanded && (
            <button
              onClick={() => setSettingsIsOpen(!settingsIsOpen)}
              className="flex size-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10"
            >
              {settingsIsOpen ? <TextCursorInput /> : <Settings2 />}
            </button>
          )}
          <button
            className="flex size-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10"
            onClick={() => {
              const newExpanded = !isExpanded;
              if (newExpanded) {
                setPopoverHeight(300);
                setPopoverWidth(400);
                setTimeout(() => {
                  setIsExpanded(newExpanded);
                }, 50);
              } else {
                setIsExpanded(newExpanded);
                setTimeout(() => {
                  setPopoverHeight(60);
                  // setExpandedWidth(newExpanded);
                  setPopoverWidth(88);
                }, 150);
              }
            }}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10"
            onClick={switchToDefaultTool}
          >
            <X />
          </button>
        </div>
      </div>

      <div className="h-2 shrink-0"></div>

      <div
        data-expanded-height={isExpanded}
        className="flex h-0 flex-col overflow-clip text-black/[0.87] transition-[height] duration-150 ease-out data-[expanded-height=true]:h-[244px] dark:text-white"
      >
        <div className="bg-mirage-200 dark:bg-mirage-800 flex h-full flex-col rounded-2xl">
          {settingsIsOpen ? (
            <div className="p-4">
              <div className="mb-0.5 text-xs font-medium text-white/[.67]">
                Condition Library
              </div>
              <Select
                value={conditionLibrary}
                onValueChange={(value) => {
                  setConditionLibrary(value as ConditionLibraryName);
                  updateToolMetadata({
                    ...toolMetadata,
                    conditionLibrary: value as ConditionLibraryName,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Condition Library" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value={"drawSteel" satisfies ConditionLibraryName}
                  >
                    Draw Steel
                  </SelectItem>
                  <SelectItem
                    value={"drawSteelWithEmojis" satisfies ConditionLibraryName}
                  >
                    Draw Steel with Emojis
                  </SelectItem>
                  <SelectItem
                    value={
                      "drawSteelEmojisOptional" satisfies ConditionLibraryName
                    }
                  >
                    Draw Steel with Optional Emojis
                  </SelectItem>
                  <SelectItem value={"dnd" satisfies ConditionLibraryName}>
                    Dungeons & Dragons
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <ConditionInput
              value={inputValue}
              onChange={(value) => {
                setInputValue(value);
                updateToolMetadata({ ...toolMetadata, condition: value });
              }}
              conditionTree={conditions[conditionLibrary]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
