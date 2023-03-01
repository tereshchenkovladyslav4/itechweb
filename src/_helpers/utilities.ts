import moment, { Moment } from "moment";
import { TimePeriodEnum } from "../Model/iTechRestApi/TimePeriodEnum";
import SelectedGridRowType from "../Model/Types/selectedGridRowType";

export {
  arrayMove,
  toDecimal,
  capitalize,
  closest,
  toSentence,
  unCapitalize,
  ciEquals,
  taskScheduledEnd,
  taskScheduledEndString,
  isJson,
  distinctBy,
  getTimePeriodDate,
  cyrb128,
  stringToHash,
  isFilterGroupColor,
  getTicks,
};

const distinctBy = (array: any[], prop: string) => {
  return [...new Map(array.map((item: any) => [item[prop], item])).values()];
};

const arrayMove = (array: Array<any>, old_index: number, new_index: number) => {
  if (new_index >= array.length) {
    let k = new_index - array.length + 1;
    while (k--) {
      array.push(undefined);
    }
  }
  array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  return array;
};

const toDecimal = (number: number, decimals: number) => {
  return number.valueOf().toFixed(decimals).toString().replace(".00", "");
};

// convert from "camelCase" to "CamelCase"
const capitalize = (str: string): string => str.charAt(0).toLocaleUpperCase() + str.slice(1);

// convert from "CamelCase" to "camelCase"
const unCapitalize = (str: string): string => str.charAt(0).toLocaleLowerCase() + str.slice(1);

// convert from "camelCase" to "Camel Case"
const toSentence = (str: string): string => {
  let newStr = str.replace(/([^A-Z])([A-Z])/g, "$1 $2");

  newStr = capitalize(newStr);
  return newStr;
};

// case insensitive string equals
const ciEquals = (a: string, b: string): boolean =>
  typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "base" }) === 0
    : a === b;

const closest = (arr: Map<any, any>, num: any) => {
  const newArray: any[] = [];

  arr.forEach((value: boolean, key: number) => {
    newArray.push(key);
  });

  newArray.sort();

  let closest = newArray[0];
  for (const item of arr) {
    if (Math.abs(<any>item - num) < Math.abs(closest - num)) {
      closest = item;
    }
  }
  return closest;
};

const taskScheduledEnd = (task: SelectedGridRowType | undefined): Moment | undefined => {
  const minutes = task?.durationMinScheduled || task?.durationMinActual || 0;
  if (minutes <= 0 || !task?.dateStartScheduledString) return undefined;

  const startDate = Date.parse(task?.dateStartScheduledString || "");
  const endDate = startDate + minutes * 60000;
  return moment(endDate);
};

const taskScheduledEndString = (task: SelectedGridRowType | undefined): string => {
  const endDate = taskScheduledEnd(task);
  return endDate?.format("YYYY-MM-DD HH:mm:ss") || "";
};

function isJson(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const getTimePeriodDate = (val: number) => {
  const datetime = moment().utc();
  switch (val) {
    case TimePeriodEnum.lastFiveMinutes:
      return datetime.subtract(5, "m");
    case TimePeriodEnum.lastHour:
      return datetime.subtract(1, "h");
    case TimePeriodEnum.yesterday:
      return datetime.subtract(1, "d");
    case TimePeriodEnum.lastWeek:
      return datetime.subtract(1, "w");
    case TimePeriodEnum.lastMonth:
      return datetime.subtract(1, "M");
    case TimePeriodEnum.lastYear:
      return datetime.subtract(1, "y");
  }
  return;
};

function cyrb128(str: string): number[] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

function stringToHash(string: string): number {
  let hash = 0;

  if (string.length == 0) return hash;

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return hash;
}

// undefined / '' are equal
const isFilterGroupColor = (selectedRow?: SelectedGridRowType, data?: any) => {
  return (selectedRow?.filterGroupColor || "") === (data?.filterGroupColor || "");
};

const getTicks = (date?: Date) => {
  if (!date) date = new Date();
  return date.getTime() * 10000 + 621355968000000000;
};
