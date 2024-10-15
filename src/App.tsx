import React, { useEffect, useState } from "react";
import "./index.css";
import { colors } from "./colors";
import Slider from "./Slider";
import { cn } from "./utils";
import OBR, { GridScale } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "./ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "./types";

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

  if (toolMetadata === undefined || gridScale === undefined) return <></>;

  return (
    <div className="bg-mirage-900/60 grid h-full grid-cols-2 gap-x-2 p-4">
      <Input
        name="Radius"
        units={gridScale.parsed.unit}
        parentValue={toolMetadata.radius * gridScale.parsed.multiplier}
        updateHandler={(value) => {
          updateToolMetadata({
            ...toolMetadata,
            radius: parseFloat(value) / gridScale.parsed.multiplier,
          });
        }}
      />
      <div className="flex h-full flex-col">
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
      <div className="col-span-2">
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
    <div className="inline-flex flex-col">
      <Label name={name} htmlFor={id} />
      <div className="outline-mirage-50/20 hover:outline-mirage-50/75 hover:focus-within:outline-primary-dark focus-within:outline-primary-dark inline-flex w-24 items-center rounded-2xl leading-[1.4375rem] outline outline-1 focus-within:outline-2">
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
        {units !== "" && <div className="text-mirage-50/75 pr-3">{units}</div>}
      </div>
    </div>
  );
}

function Label({ name, htmlFor }: { name: string; htmlFor: string }) {
  return (
    <label
      className="text-mirage-50/75 mb-1 text-xs font-medium"
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
            "h-[24px] w-[24px] rounded-full duration-100 group-hover:h-[32px] group-hover:w-[32px] group-focus-visible:h-[32px] group-focus-visible:w-[32px]",
            { "h-[32px] w-[32px]": color === currentColor },
          )}
          style={{ background: color }}
        ></div>
        <div
          className={cn(
            "absolute h-[24px] w-[24px] rounded-full outline outline-1 -outline-offset-1 outline-white/20 duration-100 group-hover:h-[32px] group-hover:w-[32px] group-focus-visible:h-[32px] group-focus-visible:w-[32px]",
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
