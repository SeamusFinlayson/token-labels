import React, { useEffect, useState } from "react";
import { colors } from "../colors";
import Slider from "../components/Slider";
import { cn, switchToDefaultTool } from "../utils";
import OBR, { GridScale } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";

function App() {
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>();
  useEffect(() => {
    OBR.tool.getMetadata(TOOL_ID).then((value) => {
      if (isToolMetadata(value)) setToolMetadata(value);
      else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata(toolMetadata);
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  const [gridScale, setGridScale] = useState<GridScale>();

  useEffect(() => {
    const updateScale = async () => {
      OBR.scene.grid.getScale().then((value) => {
        setGridScale(value);
      });
    };
    updateScale();
    return OBR.scene.grid.onChange(updateScale);
  }, []);

  if (toolMetadata === undefined || gridScale === undefined)
    return <div className="h-full bg-mirage-200 dark:bg-mirage-900/60" />;

  return (
    <div className="h-full overflow-y-clip bg-mirage-200 text-black/[0.87] dark:bg-mirage-900/60 dark:text-white">
      <div className="flex flex-col gap-2 p-4 pb-3">
        <div className="flex gap-6">
          <Input
            name="Radius"
            units={gridScale.parsed.unit}
            parentValue={toolMetadata.radius * gridScale.parsed.multiplier}
            updateHandler={(value) => {
              const newRadius = parseFloat(value);
              updateToolMetadata({
                ...toolMetadata,
                radius: Number.isNaN(newRadius)
                  ? 0
                  : newRadius / gridScale.parsed.multiplier,
              });
            }}
          />
          <div className="flex h-full w-full flex-col">
            <Label name="Opacity" htmlFor={"slider"} />
            <div className="flex flex-col items-center">
              <div className="min-w-12 text-center">{`${toolMetadata.opacity}%`}</div>
              <Slider
                id="slider"
                step={5}
                value={[toolMetadata.opacity]}
                onValueChange={(value) =>
                  updateToolMetadata({
                    ...toolMetadata,
                    opacity: value[0],
                  })
                }
              />
            </div>
          </div>
        </div>
        <div>
          <Label name="Color" htmlFor="" />
          <ColorPicker
            currentColor={toolMetadata.color}
            setColor={(color) =>
              updateToolMetadata({
                ...toolMetadata,
                color: color,
              })
            }
          />
        </div>
        <div className="flex justify-center pt-2">
          <button
            className="w-full rounded-xl px-3 py-2 text-xs font-medium text-primary shadow-sm outline outline-1 outline-primary/60 transition-all duration-150 hover:bg-primary-dark/10 hover:outline-primary dark:text-primary-dark dark:outline-primary-dark/50 dark:hover:outline-primary-dark"
            onClick={switchToDefaultTool}
          >
            CLOSE TOOL
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

function Input({
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
        <div className="inline-flex w-24 items-center rounded-2xl leading-[1.4375rem] outline outline-1 outline-mirage-950/35 focus-within:outline-2 focus-within:outline-primary hover:outline-mirage-950/[0.87] hover:focus-within:outline-primary dark:outline-mirage-50/20 dark:focus-within:outline-primary-dark dark:hover:outline-mirage-50/75 dark:hover:focus-within:outline-primary-dark">
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

function Label({ name, htmlFor }: { name: string; htmlFor: string }) {
  return (
    <label
      className="text-xs font-normal text-black/60 dark:text-mirage-50/70"
      htmlFor={htmlFor}
    >
      {name}
    </label>
  );
}

function ColorPicker({
  currentColor,
  setColor,
}: {
  currentColor: string;
  setColor: (color: string) => void;
}): JSX.Element {
  const colorButtons: JSX.Element[] = [];
  for (const color of colors) {
    colorButtons.push(
      <button
        key={color}
        onClick={() => setColor(color)}
        className="group flex h-[34px] w-[34px] items-center justify-center outline-none"
      >
        <div
          className={cn(
            "h-[24px] w-[24px] rounded-full shadow-md duration-100 group-hover:h-[32px] group-hover:w-[32px] group-focus-visible:h-[32px] group-focus-visible:w-[32px]",
            { "h-[32px] w-[32px]": color === currentColor },
          )}
          style={{ background: color }}
        ></div>
      </button>,
    );
  }

  return (
    <div className="grid grid-cols-6 place-items-center">{colorButtons}</div>
  );
}
