import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { switchToDefaultTool } from "../utils";
import OBR, { GridScale } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";
import { ColorPicker } from "../components/ColorPicker";
import { Label } from "../components/Label";
import { Input } from "../components/Input";
import { Circle, CircleCheck, Square, SquareCheck } from "lucide-react";
import { Button } from "../components/Button";

export function App() {
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
    <div className="h-full overflow-y-clip bg-mirage-200 text-black/[0.87] dark:bg-mirage-800 dark:text-white">
      <div className="flex h-full flex-col gap-2 p-4 pb-3">
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
        <div className="flex h-full gap-4">
          <div>
            <Label name="Color" htmlFor="" />
            <div className="mt-1">
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
          <div className="flex h-full grow flex-col">
            <Label name="Shape" htmlFor="" />
            <div className="mt-1 grid h-full grid-cols-1 items-stretch justify-items-stretch gap-2 text-black/[0.54] dark:text-white">
              <Button
                onClick={() =>
                  updateToolMetadata({ ...toolMetadata, shape: "CIRCLE" })
                }
              >
                {toolMetadata.shape === "CIRCLE" ? <CircleCheck /> : <Circle />}
              </Button>

              <Button
                onClick={() =>
                  updateToolMetadata({ ...toolMetadata, shape: "SQUARE" })
                }
              >
                {toolMetadata.shape === "SQUARE" ? <SquareCheck /> : <Square />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2">
          <button
            className="w-full rounded-xl px-3 py-2 text-xs font-medium text-primary shadow-xs outline outline-1 outline-primary/60 transition-all duration-150 hover:bg-primary/10 hover:outline-primary dark:text-primary-dark dark:outline-primary-dark/50 dark:hover:bg-primary-dark/10 dark:hover:outline-primary-dark"
            onClick={switchToDefaultTool}
          >
            CLOSE TOOL
          </button>
        </div>
      </div>
    </div>
  );
}
