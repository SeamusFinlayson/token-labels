import { Button } from "../components/Button";
import { ScrollArea } from "../components/scrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { conditionLibraries } from "./conditionsLibraries";
import { ConditionLibrary, ToolMetadata } from "../types";
import OBR from "@owlbear-rodeo/sdk";
import { UploadIcon } from "lucide-react";

export function SettingsMenu({
  toolMetadata,
  setToolMetadata,
}: {
  toolMetadata: ToolMetadata;
  setToolMetadata: (toolMetadata: ToolMetadata) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <ScrollArea>
        <div className="space-y-4 p-4">
          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Default Library
          </div>
          <Select
            value={toolMetadata.conditionLibraryName}
            onValueChange={(value) => {
              setToolMetadata({
                ...toolMetadata,
                conditionLibraryName: value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Condition Library" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"none"}>{"None"}</SelectItem>
              {conditionLibraries.map((lib) => (
                <SelectItem key={lib.name} value={lib.name}>
                  {lib.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Custom Conditions (click to delete)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {toolMetadata.customConditions.length === 0 ? (
              <div className="col-span-2">
                {"You have no custom conditions."}
              </div>
            ) : (
              toolMetadata.customConditions.map((condition) => (
                <Button
                  key={condition}
                  onClick={() => {
                    setToolMetadata({
                      ...toolMetadata,
                      customConditions: toolMetadata.customConditions.filter(
                        (val) => val !== condition,
                      ),
                    });
                  }}
                >
                  {condition}
                </Button>
              ))
            )}
          </div>

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Custom Condition Libraries (click to delete)
          </div>
          <div className="flex flex-wrap gap-2">
            {toolMetadata.customConditionLibraries.map((library) => (
              <Button
                key={library.name}
                onClick={() => {
                  setToolMetadata({
                    ...toolMetadata,
                    customConditionLibraries:
                      toolMetadata.customConditionLibraries.filter(
                        (val) => val.name !== library.name,
                      ),
                  });
                }}
              >
                {library.name}
              </Button>
            ))}
            <div className="w-fit">
              <label
                className="bg-mirage-200/60 hover:bg-mirage-200 focus-visible:bg-mirage-50 dark:bg-mirage-700 dark:hover:bg-mirage-600 dark:focus-visible:bg-mirage-600 flex h-8 cursor-pointer items-center justify-center rounded-lg px-4 py-0 text-sm outline-hidden duration-100 dark:shadow"
                htmlFor="uploadButton"
              >
                <UploadIcon />
              </label>
              <input
                value={""}
                onChange={(e) => {
                  const fileReader = new FileReader();
                  const files = e.target.files?.[0];
                  if (files) {
                    fileReader.readAsText(files, "UTF-8");
                    fileReader.onload = (e) => {
                      let json: ConditionLibrary | undefined = undefined;
                      if (typeof e.target?.result === "string") {
                        try {
                          json = JSON.parse(e.target?.result);
                        } catch (error) {
                          console.error(error);
                          OBR.notification.show(
                            "Could not parse file.",
                            "ERROR",
                          );
                        }
                      }
                      if (isConditionLibrary(json)) {
                        setToolMetadata({
                          ...toolMetadata,
                          customConditionLibraries: [
                            ...toolMetadata.customConditionLibraries.filter(
                              (val) => val.name !== json.name,
                            ),
                            json,
                          ],
                          enabledCustomConditionLibraries: [
                            ...toolMetadata.enabledCustomConditionLibraries,
                            json.name,
                          ],
                        });
                      } else {
                        OBR.notification.show(
                          "Invalid condition library formatting.",
                          "ERROR",
                        );
                      }
                    };
                  }
                }}
                type="file"
                accept="application/json"
                className="hidden"
                id="uploadButton"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function isConditionLibrary(value: unknown): value is ConditionLibrary {
  if (typeof value !== "object") return false;
  if (value === null) return false;

  const keys = Object.keys(value);
  if (!keys.includes("name")) return false;
  if (!keys.includes("conditionTree")) return false;

  const conditionLibrary = value as ConditionLibrary;
  if (typeof conditionLibrary.name !== "string") return false;
  if (typeof conditionLibrary.conditionTree !== "object") return false;
  if (conditionLibrary.conditionTree === null) return false;

  return true;
}
