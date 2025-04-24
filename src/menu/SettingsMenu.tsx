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
  defaultPositioningSettings,
  defaultSharingMetadata,
  defaultToolMetadata,
  SharingMetadata,
  ToolMetadata,
} from "../types";
import OBR from "@owlbear-rodeo/sdk";
import {
  AlignCenterVerticalIcon,
  AlignEndVerticalIcon,
  AlignStartVerticalIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  ArrowDownToLineIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ArrowUpToLineIcon,
  BetweenHorizontalStartIcon,
  CircleCheckIcon,
  CircleIcon,
  MoveHorizontalIcon,
  MoveVerticalIcon,
  PlayCircleIcon,
  RadioIcon,
  RadioTowerIcon,
  RefreshCwIcon,
  ScalingIcon,
  StopCircleIcon,
  Trash2Icon,
} from "lucide-react";
import { IconFadeWrapper } from "../components/IconFadeWrapper";
import { usePlayerRole } from "./usePlayerRole";
import { HELLO_CHANNEL } from "../ids";
import React, { useState } from "react";
import { UploadButton } from "./uploadButton";
import { cn, parseStringForNumber } from "../utils";
import { Input } from "../components/settingInput";

export function SettingsMenu({
  toolMetadata,
  updateToolMetadata,
  sharingMetadata,
  updateSharingMetadata,
}: {
  toolMetadata: ToolMetadata;
  updateToolMetadata: (toolMetadata: ToolMetadata) => void;
  sharingMetadata: SharingMetadata;
  updateSharingMetadata: (sharingMetadata: SharingMetadata) => void;
}) {
  const playerRole = usePlayerRole();

  const [animateSpin, setAnimateSpin] = useState(false);
  const [animatePing, setAnimatePing] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea>
        <div className="space-y-4 px-4 py-3">
          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Default Library
          </div>
          <div className="space-y-2">
            {!sharingMetadata.isHost && sharingMetadata.sharedDefaultLibrary ? (
              <div>Controlled by GM</div>
            ) : (
              <Select
                value={toolMetadata.conditionLibraryName}
                onValueChange={(value) => {
                  updateToolMetadata({
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
          </div>

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Custom Condition Libraries
          </div>
          <div className="space-y-2">
            {!sharingMetadata.isHost &&
            sharingMetadata.sharedCustomLibraries ? (
              <div>Controlled by GM</div>
            ) : (
              <>
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
                              updateToolMetadata({
                                ...toolMetadata,
                                enabledCustomConditionLibraries:
                                  toolMetadata.enabledCustomConditionLibraries.filter(
                                    (val) => val !== library.name,
                                  ),
                              })
                          : () =>
                              updateToolMetadata({
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
                        updateToolMetadata({
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
                    setToolMetadata={updateToolMetadata}
                  />
                </div>
              </>
            )}
          </div>

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
                      updateToolMetadata({
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
            {/* {
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

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Positioning and Scale
          </div>
          <div className="space-y-2">
            {!sharingMetadata.isHost &&
            sharingMetadata.sharedCustomLibraries ? (
              <div>Controlled by GM</div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Input
                    label="Horizontal Offset (px)"
                    Icon={<MoveHorizontalIcon />}
                    value={toolMetadata.horizontalOffset}
                    onUpdate={(target) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        horizontalOffset: parseStringForNumber(target.value, {
                          fallback: defaultToolMetadata.horizontalOffset,
                        }),
                      })
                    }
                  />
                  <Input
                    label="Vertical Offset (px)"
                    Icon={<MoveVerticalIcon />}
                    value={toolMetadata.verticalOffset}
                    onUpdate={(target) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        verticalOffset: parseStringForNumber(target.value, {
                          fallback: defaultToolMetadata.verticalOffset,
                        }),
                      })
                    }
                  />
                  <Input
                    label="Vertical Spacing"
                    Icon={<BetweenHorizontalStartIcon />}
                    value={toolMetadata.verticalSpacing}
                    onUpdate={(target) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        verticalSpacing: parseStringForNumber(target.value, {
                          fallback: defaultToolMetadata.verticalSpacing,
                        }),
                      })
                    }
                  />
                  <Input
                    label="Scale"
                    Icon={<ScalingIcon />}
                    value={toolMetadata.scale}
                    onUpdate={(target) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        scale: parseStringForNumber(target.value, {
                          fallback: defaultToolMetadata.scale,
                          min: 0.2,
                        }),
                      })
                    }
                  />
                  <ToggleButtonGroup
                    label=" Alignment"
                    buttons={[
                      { value: "LEFT", icon: <AlignStartVerticalIcon /> },
                      { value: "CENTER", icon: <AlignCenterVerticalIcon /> },
                      { value: "RIGHT", icon: <AlignEndVerticalIcon /> },
                    ]}
                    value={toolMetadata.alignment}
                    onChange={(value) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        alignment: value as "LEFT" | "RIGHT" | "CENTER",
                      })
                    }
                  />
                  <ToggleButtonGroup
                    label="Justification"
                    buttons={[
                      { value: "TOP", icon: <AlignVerticalJustifyStartIcon /> },
                      {
                        value: "CENTER",
                        icon: <AlignVerticalJustifyCenterIcon />,
                      },
                      {
                        value: "BOTTOM",
                        icon: <AlignVerticalJustifyEndIcon />,
                      },
                    ]}
                    value={toolMetadata.justification}
                    onChange={(value) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        justification: value as "CENTER" | "TOP" | "BOTTOM",
                      })
                    }
                  />
                  <ToggleButtonGroup
                    label="Pointer Direction"
                    buttons={[
                      { value: "LEFT", icon: <ArrowLeftToLineIcon /> },
                      { value: "RIGHT", icon: <ArrowRightToLineIcon /> },
                      { value: "UP", icon: <ArrowUpToLineIcon /> },
                      { value: "DOWN", icon: <ArrowDownToLineIcon /> },
                    ]}
                    value={toolMetadata.pointerDirection}
                    onChange={(value) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        pointerDirection: value as
                          | "LEFT"
                          | "RIGHT"
                          | "UP"
                          | "DOWN",
                      })
                    }
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    updateToolMetadata({
                      ...toolMetadata,
                      ...defaultPositioningSettings,
                    })
                  }
                >
                  <div></div>
                  Restore Defaults
                </Button>
              </>
            )}
          </div>

          <div className="mb-1 text-xs font-medium text-black/[0.54] dark:text-white/[.67]">
            Settings Sharing
          </div>
          <div className="wrap space-y-2">
            {sharingMetadata.isHost ? (
              <>
                {sharingMetadata.sharedDefaultLibrary ? (
                  <Button
                    variant={"active"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...sharingMetadata,
                        sharedDefaultLibrary: false,
                      })
                    }
                  >
                    <StopCircleIcon />
                    <div>Stop Sharing Default Library</div>
                  </Button>
                ) : (
                  <Button
                    variant={"default"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...(sharingMetadata
                          ? sharingMetadata
                          : defaultSharingMetadata),
                        sharedDefaultLibrary: true,
                      })
                    }
                  >
                    <PlayCircleIcon />
                    <div>Share Default Library</div>
                  </Button>
                )}
                {sharingMetadata.sharedCustomLibraries ? (
                  <Button
                    variant={"active"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...sharingMetadata,
                        sharedCustomLibraries: false,
                      })
                    }
                  >
                    <StopCircleIcon />
                    <div>Stop Sharing Custom Libraries</div>
                  </Button>
                ) : (
                  <Button
                    variant={"default"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...(sharingMetadata
                          ? sharingMetadata
                          : defaultSharingMetadata),
                        sharedCustomLibraries: true,
                      })
                    }
                  >
                    <PlayCircleIcon />
                    <div>Share Custom Libraries</div>
                  </Button>
                )}
                {sharingMetadata.sharedPositioningSettings ? (
                  <Button
                    variant={"active"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...sharingMetadata,
                        sharedPositioningSettings: false,
                      })
                    }
                  >
                    <StopCircleIcon />
                    <div>Stop Sharing Positioning and Scale</div>
                  </Button>
                ) : (
                  <Button
                    variant={"default"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...(sharingMetadata
                          ? sharingMetadata
                          : defaultSharingMetadata),
                        sharedPositioningSettings: true,
                      })
                    }
                  >
                    <PlayCircleIcon />
                    <div>Share Positioning and Scale</div>
                  </Button>
                )}
                {playerRole === "GM" && (
                  <Button
                    variant={"default"}
                    size={"sm"}
                    onClick={() => {
                      if (!animatePing) {
                        setAnimatePing(true);
                        setTimeout(() => setAnimatePing(false), 1000);
                      }
                      updateSharingMetadata(sharingMetadata);
                    }}
                  >
                    <RadioIcon
                      data-animate={animatePing}
                      className="data-[animate=true]:animate-ping"
                    />
                    <div>Manually Sync</div>
                  </Button>
                )}
              </>
            ) : (
              <>
                {playerRole === "GM" && (
                  <Button
                    variant={"default"}
                    size={"sm"}
                    onClick={() =>
                      updateSharingMetadata({
                        ...defaultSharingMetadata,
                        isHost: true,
                      })
                    }
                  >
                    <RadioTowerIcon />
                    <div>Share from This Device</div>
                  </Button>
                )}
                <Button
                  variant={"default"}
                  size={"sm"}
                  onClick={() => {
                    if (!animateSpin) {
                      setAnimateSpin(true);
                      setTimeout(() => setAnimateSpin(false), 500);
                    }
                    OBR.broadcast.sendMessage(HELLO_CHANNEL, {});
                  }}
                >
                  <RefreshCwIcon
                    data-spin={animateSpin}
                    className="data-[spin=true]:animate-spin"
                  />
                  <div>Manually Sync</div>
                </Button>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

interface ToggleButtonGroupProps {
  label: string;
  buttons: { value: string; icon: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
}

function ToggleButtonGroup({
  label,
  buttons,
  value,
  onChange,
}: ToggleButtonGroupProps) {
  const children = buttons.map((item) => (
    <Button
      size="icon"
      title={item.value.toLowerCase()}
      variant={"ghost"}
      key={item.value}
      value={item.value}
      onClick={() => onChange(item.value)}
    >
      <IconFadeWrapper lightModeFade={item.value !== value}>
        <div
          className={cn({
            "text-primary dark:text-primary-dark": item.value === value,
          })}
        >
          {item.icon}
        </div>
      </IconFadeWrapper>
    </Button>
  ));

  return (
    <div
      className="dark:bg-mirage-700 bg-mirage-200/60 rounded-lg px-3 py-2 dark:shadow-sm"
      onClick={() => {}}
    >
      <div className="h-full items-center space-y-1">
        <div className="text-xs text-black/[0.54] dark:text-white/[.67]">
          {label}
        </div>
        <div className="flex w-full justify-start gap-1">{children}</div>
      </div>
    </div>
  );
}
