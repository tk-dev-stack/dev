// Import necessary date parsing libraries if needed (e.g., moment.js)
import moment from "moment";

// Utility function to check and convert data types
export const dataTypeChecker = (dataType: string, value: string): any => {
  try {
    switch (dataType) {
      case "Integer": {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) throw new Error("Invalid Integer value");
        return intValue;
      }
      case "Decimal":
      case "Amount": {
        const decimalValue = parseFloat(value);
        if (isNaN(decimalValue))
          throw new Error("Invalid Decimal/Amount value");
        return decimalValue;
      }
      case "Date": {
        const dateValue = moment(
          value,
          ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
          true
        );
        if (!dateValue.isValid()) throw new Error("Invalid Date value");
        return dateValue.toDate(); // Return as JavaScript Date object
      }
      case "Time": {
        const timeValue = moment(value, ["HH:mm", "hh:mm A"], true);
        if (!timeValue.isValid()) throw new Error("Invalid Time value");
        return timeValue.format("HH:mm"); // Return in 24-hour format
      }
      case "Phone": {
        const phoneRegex = /^\d{10}$/;
        const cleanValue = value.replace(/[^\d]/g, ""); // Remove non-numeric characters
        if (!phoneRegex.test(cleanValue))
          throw new Error("Invalid Phone number");
        return cleanValue;
      }
      case "Zip Code": {
        const zipCodeRegex = /^\d{5}(-\d{4})?$/;
        if (!zipCodeRegex.test(value))
          throw new Error("Invalid Zip Code value");
        return value;
      }
      case "Email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) throw new Error("Invalid Email address");
        return value;
      }
      case "Boolean": {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
        throw new Error("Invalid Boolean value");
      }
      case "string": {
        return value; // No conversion needed for string
      }
      default: {
        throw new Error("Unsupported data type");
      }
    }
  } catch (error:any) {
    throw new Error(`Error in dataTypeChecker: ${error.message}`);
  }
};
