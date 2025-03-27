import { ConditionLibrary, ConditionTree } from "../types";

const bleedingEmoji = "🩸";
const dazedEmoji = "😵‍💫";
const frightenedEmoji = "😱";
const grabbedEmoji = "🤜";
const proneEmoji = "🦦";
const restrainedEmoji = "⛓️";
const slowedEmoji = "🐌";
const tauntedEmoji = "🫵";
const weakenedEmoji = "😫";

const oneEmoji = "1️⃣";
const diceEmoji = "🎲";

const drawSteelEmojisOptionalConditionModifiers: ConditionTree = {
  "(EoT)": { [oneEmoji]: {} },
  "(SE)": { [diceEmoji]: {} },
};
const drawSteelConditionModifiers: ConditionTree = {
  "(EoT)": {},
  "(SE)": {},
};
const drawSteelEmojisConditionModifiers: ConditionTree = {
  ["(EoT) " + oneEmoji]: {},
  ["(SE) " + diceEmoji]: {},
};

export const conditionLibraries: ConditionLibrary[] = [
  {
    name: "Draw Steel",
    conditionTree: {
      Bleeding: {
        ...drawSteelConditionModifiers,
      },
      Dazed: {
        ...drawSteelConditionModifiers,
      },
      Frightened: {
        ...drawSteelConditionModifiers,
      },
      Grabbed: {
        ...drawSteelConditionModifiers,
      },
      Prone: {
        ...drawSteelConditionModifiers,
      },
      Restrained: {
        ...drawSteelConditionModifiers,
      },
      Slowed: {
        ...drawSteelConditionModifiers,
      },
      Taunted: {
        ...drawSteelConditionModifiers,
      },
      Weakened: {
        ...drawSteelConditionModifiers,
      },
    },
  },
  {
    name: "Draw Steel with Emojis",
    conditionTree: {
      ["Bleeding " + bleedingEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Dazed " + dazedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Frightened " + frightenedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Grabbed " + grabbedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Prone " + proneEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Restrained " + restrainedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Slowed " + slowedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Taunted " + tauntedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
      ["Weakened " + weakenedEmoji]: {
        ...drawSteelEmojisConditionModifiers,
      },
    },
  },
  {
    name: "Draw Steel with Optional Emojis",
    conditionTree: {
      Bleeding: {
        [bleedingEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Dazed: {
        [dazedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Frightened: {
        [frightenedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Grabbed: {
        [grabbedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Prone: {
        [proneEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Restrained: {
        [restrainedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Slowed: {
        [slowedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Taunted: {
        [tauntedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
      Weakened: {
        [weakenedEmoji]: drawSteelEmojisOptionalConditionModifiers,
        ...drawSteelEmojisOptionalConditionModifiers,
      },
    },
  },
  {
    name: "Dungeons & Dragons",
    conditionTree: {
      Blinded: {},
      Charmed: {},
      Dead: {},
      Deafened: {},
      Dying: {},
      Frightened: {},
      Grappled: {},
      Incapacitated: {},
      Invisible: {},
      Paralyzed: {},
      Petrified: {},
      Poisoned: {},
      Prone: {},
      Restrained: {},
      Stunned: {},
      Stable: {},
      Unconscious: {},
      Exhaustion: {
        ["(1)"]: {},
        ["(2)"]: {},
        ["(3)"]: {},
        ["(4)"]: {},
        ["(5)"]: {},
        ["(6)"]: {},
      },
    },
  },
];
