/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
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
  return date.getFullYear() + getMonth.toString() + getDate.toString()
};
