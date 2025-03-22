import { useEffect, useRef, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";
import {
  setPopoverHeight,
  setPopoverWidth,
  switchToDefaultTool,
} from "../utils";
import { Button } from "../components/Button";
import { ScrollArea } from "../components/scrollArea";
import { ChevronDown, ChevronUp, Eraser, X } from "lucide-react";

interface Condition {
  [string: string]: Condition;
}

const durationModifiers: Condition = {
  "(EoT)": { [String.fromCharCode(0x0031, 0xfe0f, 0x20e3)]: {} },
  "(SE)": { [String.fromCharCode(0xd83c, 0xdfb2)]: {} },
};

const conditionsTree: Condition = {
  Bleeding: {
    [String.fromCharCode(0xd83e, 0xde78)]: durationModifiers,
    ...durationModifiers,
  },
  Dazed: {
    [String.fromCharCode(0xd83d, 0xde35) +
    String.fromCharCode(0x200d) +
    String.fromCharCode(0xd83d, 0xdcab)]: durationModifiers,
    ...durationModifiers,
  },
  Frightened: {
    [String.fromCharCode(0xd83d, 0xde31)]: durationModifiers,
    ...durationModifiers,
  },
  Grabbed: {
    [String.fromCharCode(0xd83e, 0xdd1c)]: durationModifiers,
    ...durationModifiers,
  },
  Prone: {
    [String.fromCharCode(0xd83e, 0xdda6)]: durationModifiers,
    ...durationModifiers,
  },
  Restrained: {
    [String.fromCharCode(0x26d3, 0xfe0f)]: durationModifiers,
    ...durationModifiers,
  },
  Slowed: {
    [String.fromCharCode(0xd83d, 0xdc0c)]: durationModifiers,
    ...durationModifiers,
  },
  Taunted: {
    [String.fromCharCode(0xd83e, 0xdef5)]: durationModifiers,
    ...durationModifiers,
  },
  Weakened: {
    [String.fromCharCode(0xd83d, 0xde29)]: durationModifiers,
    ...durationModifiers,
  },
};

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
        setInputValue(value.condition);
        setToolMetadata(value);
      } else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata(toolMetadata);
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  const [inputValue, setInputValue] = useState("");

  const [expandedHeight, setExpandedHeight] = useState(true);
  const [expandedWidth, setExpandedWidth] = useState(true);
  // const [initDone, setInitDone] = useEffect();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key == "Escape" && inputRef.current) {
        if (document.activeElement !== inputRef.current)
          inputRef.current.select();
        else if (inputValue !== "") {
          updateToolMetadata({ condition: "" });
          setInputValue("");
        } else switchToDefaultTool();
      }
    };
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [inputRef, inputValue]);

  if (toolMetadata === undefined)
    return <div className="bg-mirage-200 dark:bg-mirage-900/60 h-full" />;

  let conditionsSubTree = conditionsTree;
  const conditionKeys: string[] = [];
  let lowCaseSearchString = inputValue.trim().toLowerCase();
  do {
    const keyIndex = Object.keys(conditionsSubTree).findIndex((value) =>
      lowCaseSearchString.startsWith(value.toLowerCase()),
    );
    if (keyIndex === -1) break;
    const key = Object.keys(conditionsSubTree)[keyIndex];
    conditionKeys.push(key);

    lowCaseSearchString = lowCaseSearchString.substring(key.length).trim();
    conditionsSubTree = conditionsSubTree[key];
  } while (Object.keys(conditionsSubTree).length > 0);

  const conditionHints = Object.keys(conditionsSubTree).map((value) =>
    [...conditionKeys, value].join(" "),
  );

  return (
    <div className="overflow-clip">
      <div className="grid place-items-center pt-2">
        <div className="bg-mirage-900/50 flex gap-2 rounded-full backdrop-blur-2xl">
          {/* <button className="flex size-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10">
            <Settings2 />
          </button> */}
          <button
            className="flex size-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10"
            onClick={() => {
              const newExpanded = !expandedHeight;
              if (newExpanded) {
                setPopoverHeight(300);
                setPopoverWidth(400);
                setTimeout(() => {
                  setExpandedHeight(newExpanded);
                  setExpandedWidth(newExpanded);
                }, 50);
              } else {
                setExpandedHeight(newExpanded);
                setTimeout(() => {
                  setPopoverHeight(60);
                  // setExpandedWidth(newExpanded);
                  setPopoverWidth(88);
                }, 150);
              }
            }}
          >
            {expandedHeight ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button
            className="flex size-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-white/10"
            onClick={switchToDefaultTool}
          >
            <X />
          </button>
        </div>
      </div>
      <div
        data-expanded-height={expandedHeight}
        data-expanded-width={expandedWidth}
        className="flex h-0 w-full flex-col overflow-y-clip text-black/[0.87] transition-[height] duration-150 ease-out data-[expanded-height=true]:h-[252px] dark:text-white"
      >
        <div className="bg-mirage-950 mt-2 flex h-12 w-full shrink-0 items-center gap-2 rounded-t-2xl pr-1 pl-4">
          <input
            ref={inputRef}
            className="h-full w-full outline-hidden"
            placeholder="Type condition..."
            value={inputValue}
            onChange={(e) => {
              // filterConditions(e.target.value, "Winded (SE)");
              updateToolMetadata({ condition: e.target.value });
              setInputValue(e.target.value);
            }}
            autoFocus
          />
          {inputValue !== "" && (
            <button
              tabIndex={-1}
              onClick={() => {
                setInputValue("");
                updateToolMetadata({ condition: "" });
                inputRef.current?.focus();
              }}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl hover:bg-white/10"
            >
              <Eraser />
            </button>
          )}
        </div>

        <ScrollArea
          type="hover"
          className="bg-mirage-200 dark:bg-mirage-800 h-full"
        >
          <div className="flex flex-wrap gap-2 p-2">
            {conditionHints
              .filter((conditionHint) =>
                filterConditions(inputValue, conditionHint),
              )
              .sort((a, b) => sortConditions(inputValue, a, b))
              .map((conditionHint) => (
                <Button
                  className="text-nowrap"
                  key={conditionHint}
                  onClick={() => {
                    updateToolMetadata({ condition: conditionHint });
                    setInputValue(conditionHint);
                    inputRef.current?.focus();
                  }}
                >
                  {conditionHint}
                </Button>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function filterConditions(search: string, text: string): boolean {
  search = search.toLowerCase();
  text = text.toLowerCase();
  let isMatch = true;
  for (const char of search) {
    const charIndex = text.search(char.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"));
    if (charIndex === -1) {
      isMatch = false;
      break;
    }
    text = text.substring(charIndex + 1);
  }
  return isMatch;
}

function sortConditions(search: string, a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  for (const char of search) {
    const charRegExp = char.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    const aIndex = a.search(charRegExp);
    const bIndex = b.search(charRegExp);
    if (aIndex < 0 || bIndex < 0) {
      return 0;
    } else if (aIndex !== bIndex) return aIndex - bIndex;
  }
  return 0;
}
