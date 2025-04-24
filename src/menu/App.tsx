import { useState } from "react";
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
import { useToolData } from "./useToolData";

export function App() {
  const {
    toolMetadata,
    updateToolMetadata,
    sharingMetadata,
    updateSharingMetadata,
  } = useToolData();

  const [isExpanded, setIsExpanded] = useState(true);
  const [bottomRounded, setBottomRounded] = useState(false);
  const [preventResize, setPreventResize] = useState(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

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
          className="dark:bg-mirage-900/95 flex w-full rounded-t-[20px] bg-white/95 backdrop-blur-lg transition-all duration-75 ease-out data-[bottom-rounded=true]:rounded-b-[20px]"
        >
          <MenuBarButton
            lightModeFade={settingsIsOpen}
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
            lightModeFade={!settingsIsOpen}
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
            lightModeFade
            onClick={() => {
              if (!isExpanded) expandPopover();
              else collapsePopover();
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </MenuBarButton>
          <MenuBarButton lightModeFade onClick={switchToDefaultTool}>
            <XIcon />
          </MenuBarButton>
        </div>
      </div>

      <div
        data-expanded-height={isExpanded}
        className="h-0 overflow-clip text-black/[0.87] transition-[height] duration-300 ease-in-out data-[expanded-height=true]:h-[260px] dark:text-white"
      >
        <div className="h-full">
          <div className="dark:bg-mirage-900/95 h-full bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out">
            {isExpanded && (
              <>
                {settingsIsOpen ? (
                  <SettingsMenu
                    toolMetadata={toolMetadata}
                    updateToolMetadata={updateToolMetadata}
                    sharingMetadata={sharingMetadata}
                    updateSharingMetadata={updateSharingMetadata}
                  />
                ) : (
                  <ConditionInput
                    value={toolMetadata.condition}
                    onChange={(value) => {
                      updateToolMetadata(
                        { ...toolMetadata, condition: value },
                        true,
                      );
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
