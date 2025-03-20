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

const conditionHints = [
  "Bleeding",
  "Bleeding (EoT)",
  "Bleeding (SE)",
  "Dazed",
  "Dazed (EoT)",
  "Dazed (SE)",
  "Frightened",
  "Frightened (EoT)",
  "Frightened (SE)",
  "Grabbed",
  "Grabbed (EoT)",
  "Grabbed (SE)",
  "Prone",
  "Prone (EoT)",
  "Prone (SE)",
  "Restrained",
  "Restrained (EoT)",
  "Restrained (SE)",
  "Slowed",
  "Slowed (EoT)",
  "Slowed (SE)",
  "Taunted",
  "Taunted (EoT)",
  "Taunted (SE)",
  "Weakened",
  "Weakened (EoT)",
  "Weakened (SE)",
];

export function App() {
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>();
  useEffect(() => {
    OBR.tool.getMetadata(TOOL_ID).then((value) => {
      if (isToolMetadata(value)) {
        setCondition(value.condition);
        setToolMetadata(value);
      } else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata(toolMetadata);
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  const [condition, setCondition] = useState("");

  const [expandedHeight, setExpandedHeight] = useState(true);
  const [expandedWidth, setExpandedWidth] = useState(true);
  // const [initDone, setInitDone] = useEffect();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key == "Escape" && inputRef.current) {
        if (document.activeElement !== inputRef.current)
          inputRef.current.select();
        else if (condition !== "") {
          updateToolMetadata({ condition: "" });
          setCondition("");
        } else switchToDefaultTool();
      }
    };
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [inputRef, condition]);

  if (toolMetadata === undefined)
    return <div className="bg-mirage-200 dark:bg-mirage-900/60 h-full" />;

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
            value={condition}
            onChange={(e) => {
              // filterConditions(e.target.value, "Winded (SE)");
              updateToolMetadata({ condition: e.target.value });
              setCondition(e.target.value);
            }}
            autoFocus
          />
          {condition !== "" && (
            <button
              onClick={() => {
                setCondition("");
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
                filterConditions(condition, conditionHint),
              )
              .sort((a, b) => sortConditions(condition, a, b))
              .map((conditionHint) => (
                <Button
                  className="text-sm text-nowrap"
                  key={conditionHint}
                  onClick={() => {
                    updateToolMetadata({ condition: conditionHint });

                    setCondition(conditionHint);
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
    text = text.substring(charIndex);
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
