export interface ConditionTree {
  [string: string]: ConditionTree;
}

const bleedingEmoji = String.fromCharCode(0xd83e, 0xde78);
const dazedEmoji =
  String.fromCharCode(0xd83d, 0xde35) +
  String.fromCharCode(0x200d) +
  String.fromCharCode(0xd83d, 0xdcab);
const frightenedEmoji = String.fromCharCode(0xd83d, 0xde31);
const grabbedEmoji = String.fromCharCode(0xd83e, 0xdd1c);
const proneEmoji = String.fromCharCode(0xd83e, 0xdda6);
const restrainedEmoji = String.fromCharCode(0x26d3, 0xfe0f);
const slowedEmoji = String.fromCharCode(0xd83d, 0xdc0c);
const tauntedEmoji = String.fromCharCode(0xd83e, 0xdef5);
const weakenedEmoji = String.fromCharCode(0xd83d, 0xde29);

const oneEmoji = String.fromCharCode(0x0031, 0xfe0f, 0x20e3);
const diceEmoji = String.fromCharCode(0xd83c, 0xdfb2);

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

export type ConditionLibraryName =
  | "drawSteel"
  | "drawSteelWithEmojis"
  | "drawSteelEmojisOptional"
  | "dnd";

export const conditions = {
  drawSteel: {
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
  } as ConditionTree,
  drawSteelWithEmojis: {
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
  } as ConditionTree,
  drawSteelEmojisOptional: {
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
  } as ConditionTree,
  dnd: {
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
    Exhaustion: {},
  },
};
