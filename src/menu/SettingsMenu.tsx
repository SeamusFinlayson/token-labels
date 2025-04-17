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
import {
  ConditionLibrary,
  defaultSharingMetadata,
  SharingMetadata,
  ToolMetadata,
} from "../types";
import OBR from "@owlbear-rodeo/sdk";
import {
  CircleCheckIcon,
  CircleIcon,
  PlayCircleIcon,
  StopCircleIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { IconFadeWrapper } from "../components/IconFadeWrapper";
import { usePlayerRole } from "./usePlayerRole";

export function SettingsMenu({
  toolMetadata,
  setToolMetadata,
  sharingMetadata,
  setSharingMetadata,
}: {
  toolMetadata: ToolMetadata;
  setToolMetadata: (toolMetadata: ToolMetadata) => void;
  sharingMetadata: SharingMetadata | null;
  setSharingMetadata: (sharingMetadata: SharingMetadata) => void;
}) {
  const playerRole = usePlayerRole();

  return (
    <div className="flex h-full flex-col">
      <ScrollArea>
        <div className="space-y-4 px-4 py-3">
          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Default Library
          </div>
          <div className="space-y-2">
            {playerRole === "PLAYER" && !sharingMetadata ? (
              <div>Controlled by GM</div>
            ) : (
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
            )}
            {playerRole === "GM" &&
              (sharingMetadata && sharingMetadata.shareDefaultLibrary ? (
                <Button
                  variant={"active"}
                  size={"sm"}
                  onClick={() =>
                    setSharingMetadata({
                      ...sharingMetadata,
                      shareDefaultLibrary: false,
                    })
                  }
                >
                  <StopCircleIcon className="size-4" />
                  <div>Stop Sharing</div>
                </Button>
              ) : (
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() =>
                    setSharingMetadata({
                      ...(sharingMetadata
                        ? sharingMetadata
                        : defaultSharingMetadata),
                      shareDefaultLibrary: true,
                    })
                  }
                >
                  <PlayCircleIcon className="size-4" />
                  <div>Share</div>
                </Button>
              ))}
          </div>

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Custom Condition Libraries
          </div>
          {playerRole === "PLAYER" && !sharingMetadata ? (
            <div>Controlled by GM</div>
          ) : (
            <div className="space-y-2">
              {toolMetadata.customConditionLibraries.map((library) => (
                <div
                  key={library.name}
                  className="grid grid-cols-[1fr_36px] items-center gap-2"
                >
                  <Button
                    variant={"secondary"}
                    className="grid grid-cols-[20px_1fr_0px] gap-2 p-2"
                    onClick={
                      toolMetadata.enabledCustomConditionLibraries.includes(
                        library.name,
                      )
                        ? () =>
                            setToolMetadata({
                              ...toolMetadata,
                              enabledCustomConditionLibraries:
                                toolMetadata.enabledCustomConditionLibraries.filter(
                                  (val) => val !== library.name,
                                ),
                            })
                        : () =>
                            setToolMetadata({
                              ...toolMetadata,
                              enabledCustomConditionLibraries: [
                                ...toolMetadata.enabledCustomConditionLibraries,
                                library.name,
                              ],
                            })
                    }
                  >
                    <div>
                      <IconFadeWrapper>
                        {toolMetadata.enabledCustomConditionLibraries.includes(
                          library.name,
                        ) ? (
                          <CircleCheckIcon />
                        ) : (
                          <CircleIcon />
                        )}
                      </IconFadeWrapper>
                    </div>

                    <div className="truncate text-left text-sm">
                      {library.name}
                    </div>
                  </Button>
                  <Button
                    variant={"destructive"}
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
                    <IconFadeWrapper>
                      <Trash2Icon />
                    </IconFadeWrapper>
                  </Button>
                </div>
              ))}
              <div className="flex justify-start gap-2">
                <UploadButton
                  toolMetadata={toolMetadata}
                  setToolMetadata={setToolMetadata}
                />
                {playerRole === "GM" &&
                  (sharingMetadata && sharingMetadata.shareCustomLibraries ? (
                    <Button
                      variant={"active"}
                      size={"sm"}
                      onClick={() =>
                        setSharingMetadata({
                          ...sharingMetadata,
                          shareCustomLibraries: false,
                        })
                      }
                    >
                      <StopCircleIcon className="size-4" />
                      <div>Stop Sharing</div>
                    </Button>
                  ) : (
                    <Button
                      variant={"default"}
                      size={"sm"}
                      onClick={() =>
                        setSharingMetadata({
                          ...(sharingMetadata
                            ? sharingMetadata
                            : defaultSharingMetadata),
                          shareCustomLibraries: true,
                        })
                      }
                    >
                      <PlayCircleIcon className="size-4" />
                      <div>Share</div>
                    </Button>
                  ))}
              </div>
            </div>
          )}

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Custom Conditions (click to delete)
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {toolMetadata.customConditions.length === 0 ? (
                <div className="col-span-2">
                  {"You have no custom conditions."}
                </div>
              ) : (
                toolMetadata.customConditions.map((condition) => (
                  <Button
                    variant={"secondary"}
                    size={"sm"}
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
            {/* {playerRole === "GM" &&
              (sharingMetadata && sharingMetadata.shareCustomConditions ? (
                <Button
                  variant={"active"}
                  size={"sm"}
                  onClick={() =>
                    setSharingMetadata({
                      ...sharingMetadata,
                      shareCustomConditions: false,
                    })
                  }
                >
                  <StopCircleIcon className="size-4" />
                  <div>Stop Sharing</div>
                </Button>
              ) : (
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() =>
                    setSharingMetadata({
                      ...(sharingMetadata
                        ? sharingMetadata
                        : defaultSharingMetadata),
                      shareCustomConditions: true,
                    })
                  }
                >
                  <PlayCircleIcon className="size-4" />
                  <div>Share</div>
                </Button>
              ))} */}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function UploadButton({
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
        <UploadIcon className="size-4" />
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
