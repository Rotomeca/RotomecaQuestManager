import { EMPTY_STRING } from '@rotomeca/framework-electron.js';
import ISerializable from '../interfaces/ISerializable.js';
export {
  QuestType,
  QuestStepType,
  QuestRewardType,
  QuestStepStructure,
  QuestRewardStructure,
};
export default class QuestStructure extends ISerializable {
  constructor({
    name = EMPTY_STRING,
    description = EMPTY_STRING,
    questType = QuestType.MAIN,
    giver = EMPTY_STRING,
    location = EMPTY_STRING,
    steps = [],
    rewards = [],
  } = {}) {
    super();
    this.#_init().#_setup({
      name,
      description,
      questType,
      giver,
      location,
      steps,
      rewards,
    });
  }

  #_init() {
    this.name = EMPTY_STRING;
    this.description = EMPTY_STRING;
    this.questType = QuestType.MAIN;
    this.giver = EMPTY_STRING;
    this.location = EMPTY_STRING;
    this.steps = [];
    this.rewards = [];

    return this;
  }

  #_setup({
    name = EMPTY_STRING,
    description = EMPTY_STRING,
    questType = QuestType.MAIN,
    giver = EMPTY_STRING,
    location = EMPTY_STRING,
    steps = [],
    rewards = [],
  } = {}) {
    this.name = name;
    this.description = description;
    this.questType = questType;
    this.giver = giver;
    this.location = location;
    this.steps = steps;
    this.rewards = rewards;

    return this;
  }

  #_serializeArray(array) {
    return array.map((item) => {
      if (typeof item === 'object' && item !== null && item.serialize) {
        return item.serialize();
      }
      return item;
    });
  }

  addStep(step) {
    if (step instanceof QuestStepStructure) {
      this.steps.push(step);
    } else {
      throw new Error('Invalid step type');
    }
  }

  addReward(reward) {
    if (reward instanceof QuestRewardStructure) {
      this.rewards.push(reward);
    } else {
      throw new Error('Invalid reward type');
    }
  }

  serialize() {
    return JSON.stringify({
      name: this.name,
      description: this.description,
      questType: QuestStructure.SymbolToString(QuestType, this.questType),
      giver: this.giver,
      location: this.location,
      steps: this.#_serializeArray(this.steps),
      rewards: this.#_serializeArray(this.rewards),
    });
  }

  static SymbolToString(enumObject, value) {
    for (const [key, val] of Object.entries(enumObject)) {
      if (val === value) {
        return key;
      }
    }
    return null;
  }

  static StringToSymbol(enumObject, str) {
    for (const [key, val] of Object.entries(enumObject)) {
      if (key === str) {
        return val;
      }
    }
    return null;
  }
}

/**
 * @enum {Symbol}
 * @property {Symbol} MAIN
 * @property {Symbol} SIDE
 */
const QuestType = {
  MAIN: Symbol('main'),
  SIDE: Symbol('side'),
};

class QuestStepStructure extends ISerializable {
  constructor({
    type = QuestStepType.VARIABLE,
    gameDataId = 0,
    description = EMPTY_STRING,
    amount = 0,
    isHidden = false,
    nextSteps = [],
  } = {}) {
    super();
    this.#_init().#_setup({
      type,
      gameDataId,
      description,
      amount,
      isHidden,
      nextSteps,
    });
  }

  #_init() {
    this.type = QuestStepType.VARIABLE;
    this.gameDataId = 0;
    this.description = EMPTY_STRING;
    this.amount = 0;
    this.isHidden = false;
    this.nextSteps = [];

    return this;
  }

  #_setup({
    type = QuestStepType.VARIABLE,
    gameDataId = 0,
    description = EMPTY_STRING,
    amount = 0,
    isHidden = false,
    nextSteps = [],
  } = {}) {
    this.type = type;
    this.gameDataId = gameDataId;
    this.description = description;
    this.amount = amount;
    this.isHidden = isHidden;
    this.nextSteps = nextSteps;

    return this;
  }

  serialize() {
    return JSON.stringify({
      type: QuestStepStructure.SymbolToString(QuestStepType, this.type),
      gameDataId: this.gameDataId,
      description: this.description,
      amount: this.amount,
      isHidden: this.isHidden,
      nextSteps: this.nextSteps,
    });
  }
}

/**
 * @enum {Symbol}
 * @property {Symbol} VARIABLE
 * @property {Symbol} SWITCH
 * @property {Symbol} LOCATION
 * @property {Symbol} TALKING
 * @property {Symbol} ENNEMY
 * @property {Symbol} ITEMS
 * @property {Symbol} WEAPONS
 * @property {Symbol} ARMORS
 * @property {Symbol} CUSTOM
 */
const QuestStepType = {
  VARIABLE: Symbol('variable'),
  SWITCH: Symbol('switch'),
  LOCATION: Symbol('location'),
  TALKING: Symbol('talking'),
  ENNEMY: Symbol('ennemy'),
  ITEMS: Symbol('items'),
  WEAPONS: Symbol('weapons'),
  ARMORS: Symbol('armors'),
  CUSTOM: Symbol('custom'),
};

/**
 * @enum {Symbol}
 * @property {Symbol} VARIABLE
 * @property {Symbol} SWITCH
 * @property {Symbol} GOLD
 * @property {Symbol} ITEM
 * @property {Symbol} ARMOR
 * @property {Symbol} WEAPON
 * @property {Symbol} QUEST
 * @property {Symbol} CUSTOM
 */
const QuestRewardType = {
  VARIABLE: Symbol('variable'),
  SWITCH: Symbol('switch'),
  GOLD: Symbol('gold'),
  ITEM: Symbol('item'),
  ARMOR: Symbol('armor'),
  WEAPON: Symbol('weapon'),
  QUEST: Symbol('quest'),
  CUSTOM: Symbol('custom'),
};

// --- QuestRewardStructure class ---
class QuestRewardStructure extends ISerializable {
  constructor({ type = QuestRewardType.VARIABLE, amount = 0, id = 0 } = {}) {
    super();
    this.#_init().#_setup({ type, amount, id });
  }

  #_init() {
    this.type = QuestRewardType.VARIABLE;
    this.amount = 0;
    this.id = 0;
    return this;
  }

  #_setup({ type = QuestRewardType.VARIABLE, amount = 0, id = 0 } = {}) {
    this.type = type;
    this.amount = amount;
    this.id = id;
    return this;
  }

  serialize() {
    return JSON.stringify({
      type: QuestStructure.SymbolToString(QuestRewardType, this.type),
      amount: this.amount,
      id: this.id,
    });
  }
}
