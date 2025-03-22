import { useEffect, useRef } from "react";
import { switchToDefaultTool } from "../utils";
import { Eraser } from "lucide-react";
import { ScrollArea } from "../components/scrollArea";
import { Button } from "../components/Button";
import { ConditionTree } from "./conditionsTree";

export function ConditionInput({
  value,
  onChange,
  conditionTree,
}: {
  value: string;
  onChange: (value: string) => void;
  conditionTree: ConditionTree;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key == "Escape" && inputRef.current) {
        if (document.activeElement !== inputRef.current)
          inputRef.current.select();
        else if (value !== "") {
          onChange("");
        } else switchToDefaultTool();
      }
    };
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [inputRef, onChange, value]);

  let conditionsSubTree = conditionTree;
  const conditionKeys: string[] = [];
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

  const conditionHints = Object.keys(conditionsSubTree).map((value) =>
    [...conditionKeys, value].join(" "),
  );

  return (
    <>
      <div className="bg-mirage-950 flex h-12 w-full shrink-0 items-center gap-2 rounded-t-2xl pr-1 pl-4">
        <input
          ref={inputRef}
          className="h-full w-full outline-hidden"
          placeholder="Type condition..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          autoFocus
        />
        {value !== "" && (
          <button
            tabIndex={-1}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl hover:bg-white/10"
          >
            <Eraser />
          </button>
        )}
      </div>

      <ScrollArea className="h-full">
        <div className="flex flex-wrap gap-2 p-2">
          {conditionHints
            .filter((conditionHint) => filterConditions(value, conditionHint))
            .sort((a, b) => sortConditions(value, a, b))
            .map((conditionHint) => (
              <Button
                className="text-nowrap"
                key={conditionHint}
                onClick={() => {
                  onChange(conditionHint);
                  inputRef.current?.focus();
                }}
              >
                {conditionHint}
              </Button>
            ))}
        </div>
      </ScrollArea>
    </>
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
