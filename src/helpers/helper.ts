import { DataTypes } from "@constants/dataTypeOptions";

//function to determine the type of a given item array or object
export const getType = (item: any) => {
  return Object.prototype.toString.call(item).slice(8, -1).toLowerCase(); // Returns the type as a lowercase string
};
// Utility function to get the primitive type (string, number, boolean, etc.)
export const getValueType = (value: any): string => {
  const dataType = typeof value; // Returns the primitive type as a string (e.g., "string", "number")
  if (dataType === "number") {
    return DataTypes.Decimal;
  } else {
    return dataType;
  }
};
