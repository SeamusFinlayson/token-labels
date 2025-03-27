import { useEffect, useRef } from "react";
import { Eraser } from "lucide-react";
import { ScrollArea } from "../components/scrollArea";
import { Button } from "../components/Button";
import { ConditionTree } from "../types";

export function ConditionInput({
  value,
  onChange,
  conditionTree,
  saveCondition,
}: {
  value: string;
  onChange: (value: string) => void;
  conditionTree: ConditionTree;
  saveCondition: (condition: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key == "Escape" && inputRef.current) {
        if (document.activeElement !== inputRef.current)
          inputRef.current.select();
        else onChange("");
        // if (value !== "") {
        // } else switchToDefaultTool();
      }
    };
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [inputRef, onChange, value]);

  const { conditionHints, isExactMatch } = getConditionHints(
    value,
    conditionTree,
  );

  return (
    <div className="group flex h-full flex-col">
      <div className="px-4 py-3 transition-[padding] group-focus-within:px-2">
        <div className="bg-mirage-200/60 dark:bg-mirage-700 flex w-full items-center justify-between rounded-full pr-2 duration-300 group-focus-within:bg-transparent dark:shadow dark:group-focus-within:bg-transparent dark:group-focus-within:shadow-none">
          <input
            ref={inputRef}
            className="hover:bg-600 dark:placeholder-mirage-100/70 w-full shrink grow p-2 pr-0 pl-4 placeholder-black/[0.54] outline-hidden transition-all group-focus-within:pl-2"
            placeholder="Type condition..."
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            autoFocus
          />
          {value !== "" && (
            <Button
              tabIndex={-1}
              onMouseDown={() => {
                onChange("");
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 0);
              }}
              className="dark:hover:bg-mirage-700 flex size-10 shrink-0 items-center justify-center rounded-full bg-transparent p-0 text-black shadow-none dark:bg-transparent dark:text-white dark:shadow-none"
            >
              <div className="opacity-[0.54] dark:opacity-[1]">
                <Eraser />
              </div>
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="flex flex-wrap gap-2 p-4 pt-0">
          {[...conditionHints]
            .filter((conditionHint) =>
              filterConditionHints(value, conditionHint),
            )
            .sort((a, b) => sortConditionHints(value, a, b))
            .map((conditionHint) => (
              <Button
                key={conditionHint}
                onClick={() => {
                  onChange(conditionHint);
                  inputRef.current?.focus();
                }}
              >
                {conditionHint}
              </Button>
            ))}
          {!isExactMatch && (
            <Button
              onClick={() => {
                saveCondition(value);
              }}
            >
              Save Condition
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function getConditionHints(value: string, conditionTree: ConditionTree) {
  const conditionKeys: string[] = [];
  let conditionsSubTree = conditionTree;
  let lowCaseSearchString = value.trim().toLowerCase();
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

  return {
    conditionHints: Object.keys(conditionsSubTree).map((value) =>
      [...conditionKeys, value].join(" "),
    ),
    isExactMatch: lowCaseSearchString.length === 0,
  };
}

function filterConditionHints(value: string, hint: string): boolean {
  value = value.toLowerCase();
  hint = hint.toLowerCase();

  for (const char of value) {
    const charIndex = hint.indexOf(char);
    if (charIndex === -1) return false;
    hint = hint.substring(charIndex + 1);
  }

  return true;
}

function sortConditionHints(value: string, a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  for (const char of value) {
    const aIndex = a.indexOf(char);
    const bIndex = b.indexOf(char);
    if (aIndex < 0 || bIndex < 0) return 0;
    else if (aIndex !== bIndex) return aIndex - bIndex;
  }
  return 0;
}
