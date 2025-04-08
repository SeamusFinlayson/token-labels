import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";
import { cn, setPopoverHeight, switchToDefaultTool } from "../utils";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Icon,
  Settings2Icon,
  XIcon,
} from "lucide-react";
import { ConditionInput } from "./conditionInput";
import { SettingsMenu } from "./SettingsMenu";
import { MenuBarButton } from "../components/menuBarButton";
import { conditionLibraries } from "./conditionsLibraries";
import { featherText } from "@lucide/lab";

export function App() {
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>();
  useEffect(() => {
    OBR.tool.getMetadata(TOOL_ID).then((value) => {
      if (isToolMetadata(value)) {
        setToolMetadata(value);
      } else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata({ ...toolMetadata });
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  const [isExpanded, setIsExpanded] = useState(true);
  const [bottomRounded, setBottomRounded] = useState(false);
  const [preventResize, setPreventResize] = useState(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  if (toolMetadata === undefined)
    return <div className="bg-mirage-200 dark:bg-mirage-800 h-full" />;

  const expandPopover = () => {
    if (!preventResize) {
      setPreventResize(true);
      setPopoverHeight(300);
      setBottomRounded(false);
      setTimeout(() => {
        setIsExpanded(true);
        setPreventResize(false);
      }, 50);
    }
  };

  const collapsePopover = () => {
    if (!preventResize) {
      setPreventResize(true);
      setIsExpanded(false);
      setTimeout(() => {
        setBottomRounded(true);
      }, 300);
      setTimeout(() => {
        setPopoverHeight(40);
        setPreventResize(false);
      }, 375);
    }
  };

  const conditionTree = conditionLibraries.find(
    (lib) => lib.name === toolMetadata.conditionLibraryName,
  )?.conditionTree;

  return (
    <div>
      <div className="flex justify-center">
        <div
          data-bottom-rounded={bottomRounded}
          className="bg-mirage-50/95 dark:bg-mirage-900/95 flex w-full rounded-t-[20px] backdrop-blur-lg transition-all duration-75 ease-out data-[bottom-rounded=true]:rounded-b-[20px]"
        >
          <MenuBarButton
            fade={settingsIsOpen}
            onClick={() => {
              if (!isExpanded) expandPopover();
              setSettingsIsOpen(false);
            }}
          >
            <div
              className={cn({
                "text-primary dark:text-primary-dark": settingsIsOpen === false,
              })}
            >
              <Icon iconNode={featherText} />
              {/* <PenLineIcon /> */}
            </div>
          </MenuBarButton>
          <MenuBarButton
            fade={!settingsIsOpen}
            onClick={() => {
              if (!isExpanded) expandPopover();
              setSettingsIsOpen(true);
            }}
          >
            <div
              className={cn({
                "text-primary dark:text-primary-dark": settingsIsOpen === true,
              })}
            >
              <Settings2Icon />
            </div>
          </MenuBarButton>

          <div className="grow"></div>
          <MenuBarButton
            fade
            onClick={() => {
              if (!isExpanded) expandPopover();
              else collapsePopover();
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </MenuBarButton>
          <MenuBarButton fade onClick={switchToDefaultTool}>
            <XIcon />
          </MenuBarButton>
        </div>
      </div>

      <div
        data-expanded-height={isExpanded}
        className="h-0 overflow-clip text-black/[0.87] transition-[height] duration-300 ease-in-out data-[expanded-height=true]:h-[260px] dark:text-white"
      >
        <div className="h-full">
          <div className="bg-mirage-50/95 dark:bg-mirage-900/95 h-full backdrop-blur-lg transition-all duration-300 ease-in-out">
            {isExpanded && (
              <>
                {settingsIsOpen ? (
                  <SettingsMenu
                    toolMetadata={toolMetadata}
                    setToolMetadata={updateToolMetadata}
                  />
                ) : (
                  <ConditionInput
                    value={toolMetadata.condition}
                    onChange={(value) => {
                      updateToolMetadata({ ...toolMetadata, condition: value });
                    }}
                    conditionTree={{
                      ...conditionTree,
                      ...Object.assign(
                        {},
                        ...toolMetadata.customConditions.map((value) => ({
                          [value]: {},
                        })),
                      ),
                      ...Object.assign(
                        {},
                        ...toolMetadata.customConditionLibraries
                          .filter((val) =>
                            toolMetadata.enabledCustomConditionLibraries.includes(
                              val.name,
                            ),
                          )
                          .map((val) => val.conditionTree),
                      ),
                    }}
                    saveCondition={(condition) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        customConditions: [
                          ...new Set([
                            ...toolMetadata.customConditions,
                            condition,
                          ]),
                        ],
                      })
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
