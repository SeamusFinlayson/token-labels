import React, { useState, useEffect } from "react";
import { Label } from "./Label";

export function Input({
  name,
  units,
  inputProps,
  parentValue,
  updateHandler,
}: {
  name: string;
  units: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  parentValue: number;
  updateHandler: (value: string) => void;
}) {
  const id = `input-${name}-units`;

  const [value, setValue] = useState<string>(parentValue.toString());
  let ignoreBlur = false;

  // Update value when the value changes in parent
  const [valueInputUpdateFlag, setValueInputUpdateFlag] = useState(false);
  if (valueInputUpdateFlag) {
    setValue(parentValue.toString());
    setValueInputUpdateFlag(false);
  }
  useEffect(() => setValueInputUpdateFlag(true), [parentValue]);

  // Update value in parent element
  const runUpdateHandler = (
    e:
      | React.FocusEvent<HTMLInputElement, Element>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    updateHandler((e.target as HTMLInputElement).value);
    setValueInputUpdateFlag(true);
  };

  return (
    <div className="flex flex-col">
      <Label name={name} htmlFor={id} />
      <div className="flex h-full items-end">
        <div className="inline-flex w-24 items-center rounded-xl leading-[1.4375rem] outline outline-1 outline-mirage-950/35 focus-within:outline-2 focus-within:outline-primary hover:outline-mirage-950/[0.87] hover:focus-within:outline-primary dark:outline-mirage-50/20 dark:focus-within:outline-primary-dark dark:hover:outline-mirage-50/75 dark:hover:focus-within:outline-primary-dark">
          <input
            className="w-full bg-transparent py-[7.5px] pl-3 outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => {
              if (!ignoreBlur) runUpdateHandler(e);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              } else if (e.key === "Escape") {
                ignoreBlur = true;
                (e.target as HTMLInputElement).blur();
                ignoreBlur = false;
                setValue(parentValue.toString());
              }
            }}
            {...inputProps}
            id={id}
          />
          {units !== "" && (
            <div className="pr-3 text-black/60 dark:text-mirage-50/70">
              {units}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
