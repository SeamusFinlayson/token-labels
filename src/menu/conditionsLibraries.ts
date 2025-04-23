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

const drawSteelConditionModifiers: ConditionTree = {
  "(EoT)": {},
  "(SE)": {},
};
const drawSteelEmojisConditionModifiers: ConditionTree = {
  ["(EoT) " + oneEmoji]: {},
  ["(SE) " + diceEmoji]: {},
};
const dndConditionModifiers: ConditionTree = {
  ["()"]: {},
};
const dndWithEmojisConditionModifiers: ConditionTree = {
  ["() " + diceEmoji]: {},
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
      Winded: {},
      Dying: {},
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
      ["Winded " + "🍃"]: {},
      ["Dying " + "💀"]: {},
    },
  },
  {
    name: "Dungeons & Dragons",
    conditionTree: {
      Blinded: { ...dndConditionModifiers },
      Charmed: { ...dndConditionModifiers },
      Dazed: { ...dndConditionModifiers },
      Dead: { ...dndConditionModifiers },
      Deafened: { ...dndConditionModifiers },
      Dying: { ...dndConditionModifiers },
      Frightened: { ...dndConditionModifiers },
      Grappled: { ...dndConditionModifiers },
      Incapacitated: { ...dndConditionModifiers },
      Invisible: { ...dndConditionModifiers },
      Paralyzed: { ...dndConditionModifiers },
      Petrified: { ...dndConditionModifiers },
      Poisoned: { ...dndConditionModifiers },
      Prone: { ...dndConditionModifiers },
      Restrained: { ...dndConditionModifiers },
      Silenced: { ...dndConditionModifiers },
      Stunned: { ...dndConditionModifiers },
      Unconscious: { ...dndConditionModifiers },
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
  {
    name: "Dungeons & Dragons with Emojis",
    conditionTree: {
      ["Blinded " + "🙈"]: { ...dndWithEmojisConditionModifiers },
      ["Charmed " + "✨"]: { ...dndWithEmojisConditionModifiers },
      ["Dazed " + dazedEmoji]: { ...dndWithEmojisConditionModifiers },
      ["Dead " + " 💀"]: { ...dndWithEmojisConditionModifiers },
      ["Deafened " + "🙉"]: { ...dndWithEmojisConditionModifiers },
      ["Dying " + "😵"]: { ...dndWithEmojisConditionModifiers },
      ["Frightened " + frightenedEmoji]: { ...dndWithEmojisConditionModifiers },
      ["Grappled " + grabbedEmoji]: { ...dndWithEmojisConditionModifiers },
      ["Incapacitated"]: { ...dndWithEmojisConditionModifiers },
      ["Invisible " + "🫥"]: { ...dndWithEmojisConditionModifiers },
      ["Paralyzed " + "⚡"]: { ...dndWithEmojisConditionModifiers },
      ["Petrified " + "🪨"]: { ...dndWithEmojisConditionModifiers },
      ["Poisoned " + "🐍"]: { ...dndWithEmojisConditionModifiers },
      ["Prone " + proneEmoji]: { ...dndWithEmojisConditionModifiers },
      ["Restrained " + restrainedEmoji]: { ...dndWithEmojisConditionModifiers },
      ["Silenced " + "🙊"]: { ...dndWithEmojisConditionModifiers },
      ["Stunned " + dazedEmoji]: { ...dndWithEmojisConditionModifiers },
      ["Unconscious " + "😴"]: { ...dndWithEmojisConditionModifiers },
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
