import OBR from "@owlbear-rodeo/sdk";
import { UploadIcon } from "lucide-react";
import { ToolMetadata, ConditionLibrary } from "../types";

export function UploadButton({
  toolMetadata,
  setToolMetadata,
}: {
  toolMetadata: ToolMetadata;
  setToolMetadata: (toolMetadata: ToolMetadata) => void;
}) {
  return (
    <div>
      <label
        className="bg-mirage-800 hover:bg-mirage-700 dark:bg-mirage-100 focus-visible:bg-mirage-200 dark:hover:bg-mirage-200 dark:focus-visible:bg-mirage-200 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm text-white outline-hidden duration-100 dark:text-black"
        htmlFor="uploadButton"
      >
        <UploadIcon className="size-4.5" />
        <div>Upload</div>
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
                  OBR.notification.show("Could not parse file.", "ERROR");
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
