import { UserFlags } from "@/interfaces/users.interface";

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === "object" &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const getDate = (date: Date) => {
  let getMonth;
  let getDate;
  if (date.getMonth() < 10) getMonth = "0" + Number(date.getMonth() + 1);
  else getMonth = Number(date.getMonth() + 1);
  if (date.getDate() < 10) getDate = "0" + Number(date.getDate());
  else getDate = Number(date.getDate());
  return date.getFullYear() + getMonth.toString() + getDate.toString();
};

export function checkUserFlag(
  base: number,
  required: number | keyof typeof UserFlags
): boolean {
  return checkFlag(
    base,
    typeof required === "number" ? required : UserFlags[required]
  );
}

function checkFlag(base: number, required: number) {
  return (base & required) === required;
}

export enum BusList {
  namgu = "남구",
  seogu = "서구",
  buphong = "부평",
  yeonsu = "연수",
}

export const Buslists = [
  {
    label: "남구노선",
    value: "namgu",
    key: "namgu",
  },
  {
    label: "서구노선",
    value: "seogu",
    key: "seogu",
  },
  {
    label: "부평노선",
    value: "buphong",
    key: "buphong",
  },
  {
    label: "연수노선",
    value: "yeonsu",
    key: "yeonsu",
  },
];
