import { useEffect, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../ids";
import { defaultToolMetadata, isToolMetadata, ToolMetadata } from "../types";
import { cn, setPopoverHeight, switchToDefaultTool } from "../utils";
import { ChevronDown, ChevronUp, Settings2, Terminal, X } from "lucide-react";
import { conditions } from "./conditionsTree";
import { ConditionTree } from "../types";
import { ConditionLibraryName } from "../types";
import { ConditionInput } from "./conditionInput";
import { SettingsMenu } from "./SettingsMenu";
import { MenuBarButton } from "../components/menuBarButton";

// const conditionHints = [
//   "Blinded",
//   "Charmed",
//   "Dead",
//   "Deafened",
//   "Dying",
//   "Frightened",
//   "Grappled",
//   "Incapacitated",
//   "Invisible",
//   "Paralyzed",
//   "Petrified",
//   "Poisoned",
//   "Prone",
//   "Restrained",
//   "Stunned",
//   "Stable",
//   "Unconscious",
//   "Exhaustion",
// ];

// const conditionHints = [
//   "Blind",
//   "Concentrating",
//   "Charmed",
//   "Deafened",
//   "Exhausted",
//   "Frightened",
//   "Grappled",
//   "Incapacitated",
//   "Invisible",
//   "Paralyzed",
//   "Petrified",
//   "Poisoned",
//   "Prone",
//   "Restrained",
//   "Stunned",
//   "Unconscious",
//   "Stabilized",
//   "Dead",
//   "Advantage",
//   "Baned",
//   "Bleeding Out",
//   "Blessed",
//   "Disadvantage",
//   "Dodge",
//   "Flying",
//   "Hasted",
//   "Hexblade's Curse",
//   "Hexed",
//   "Holding Action",
//   "Hunter's Mark",
//   "Inspired",
//   "Mage Armor",
//   "Raging",
//   "Reaction Used",
//   "Armor of Agathys",
//   "Blink",
//   "Blur",
//   "Confused",
//   "Insightful Fighting",
//   "Mirror Image",
//   "On Fire",
//   "Possessed",
//   "Sanctuary",
//   "Shield of Faith",
//   "Spirit Guardian",
//   "Summoning",
//   "Symbiotic Entity",
//   "Shifted",
//   "Truesight",
//   "Warding Bond",
//   "Ancestral Protectors",
//   "Cause of Fear",
//   "Compelled Duel",
//   "Divine Favor",
//   "Highlighted",
//   "Slayer's Prey",
//   "Shell Defense",
//   "Bear's Endurance",
//   "Bull's Strength",
//   "Cat's Grace",
//   "Eagle's Splendor",
//   "Fox's Cunning",
//   "Owl's Wisdom",
// ];

export function App() {
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>();
  useEffect(() => {
    OBR.tool.getMetadata(TOOL_ID).then((value) => {
      if (isToolMetadata(value)) {
        setToolMetadata(value);
        setInputValue(value.condition);
        setConditionLibrary(value.conditionLibrary);
      } else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata(toolMetadata);
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  const [isExpanded, setIsExpanded] = useState(true);
  const [preventResize, setPreventResize] = useState(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);

  const [conditionLibrary, setConditionLibrary] =
    useState<ConditionLibraryName>("drawSteel");
  const [inputValue, setInputValue] = useState("");

  if (toolMetadata === undefined)
    return <div className="bg-mirage-200 dark:bg-mirage-800 h-full" />;

  const expandPopover = () => {
    if (!preventResize) {
      setPreventResize(true);
      setPopoverHeight(300);
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
        setPopoverHeight(40);
        setPreventResize(false);
      }, 300);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <div
          data-is-expanded={isExpanded}
          className="bg-mirage-50/[0.97] dark:bg-mirage-900/95 flex w-full rounded-t-[20px] backdrop-blur-lg transition-all duration-300 data-[is-expanded=false]:rounded-b-[20px]"
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
              <Terminal />
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
              <Settings2 />
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
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </MenuBarButton>
          <MenuBarButton fade onClick={switchToDefaultTool}>
            <X />
          </MenuBarButton>
        </div>
      </div>

      <div
        data-expanded-height={isExpanded}
        className="h-0 overflow-clip text-black/[0.87] transition-[height] duration-300 ease-in-out data-[expanded-height=true]:h-[260px] dark:text-white"
      >
        <div className="h-full">
          <div className="bg-mirage-50/[0.97] dark:bg-mirage-900/95 h-full backdrop-blur-lg">
            {isExpanded && (
              <>
                {settingsIsOpen ? (
                  <SettingsMenu
                    conditionLibrary={conditionLibrary}
                    setConditionLibrary={(value) => {
                      setConditionLibrary(value);
                      updateToolMetadata({
                        ...toolMetadata,
                        conditionLibrary: value,
                      });
                    }}
                    customConditions={toolMetadata.customConditions}
                    setCustomConditions={(conditions) =>
                      updateToolMetadata({
                        ...toolMetadata,
                        customConditions: conditions,
                      })
                    }
                  />
                ) : (
                  <ConditionInput
                    value={inputValue}
                    onChange={(value) => {
                      setInputValue(value);
                      updateToolMetadata({ ...toolMetadata, condition: value });
                    }}
                    conditionTree={{
                      ...conditions[conditionLibrary],
                      ...(Object.assign(
                        {},
                        ...toolMetadata.customConditions.map((value) => ({
                          [value]: {},
                        })),
                      ) as ConditionTree),
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
