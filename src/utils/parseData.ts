import { getType, getValueType } from "../helpers/helper";

export const parseData = (
  data: any,
  prefix: string = ""
): { key: string; value: string; type: string }[] => {
  const result: { key: string; value: string; type: string }[] = [];

  const parseObject = (obj: any) => {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        // Check if the key is a property of the object
        const value = obj[key];
        // Create a full key for the current item (e.g., "parent child")
        const fullKey = key;

        if (getType(value) === "object") {
          parseObject(value);
        } else if (getType(value) === "array") {
          parseArray(value, fullKey);
        } else {
          result.push({
            key: fullKey,
            value: String(value),
            type: getValueType(value),
          });
        }
      }
    }
  };

  const parseArray = (arr: any[], parentKey: string = "") => {
    arr.forEach((item) => {
      const fullKey = `${parentKey}`;
      if (getType(item) === "object") {
        parseObject(item); // Recursively parse nested objects
      } else if (getType(item) === "array") {
        parseArray(item, fullKey); // Recursively parse nested arrays
      } else {
        result.push({
          key: fullKey,
          value: String(item),
          type: getValueType(item),
        });
      }
    });
  };

  if (getType(data) === "object") {
    parseObject(data);
  } else if (getType(data) === "array") {
    parseArray(data, prefix);
  }

  return result;
};


// import { getType, getValueType } from "./helper";

// export const parseData = (
//   data: any,
// ): { key: string; value: string; type: string }[] => {
//   const result: { key: string; value: string; type: string }[] = [];

//   const parseObject = (obj: any) => {
//     for (const key in obj) {
//       if (Object.hasOwnProperty.call(obj, key)) {
//         const value = obj[key];

//         if (getType(value) === "object") {
//           parseObject(value); // Recursively parse nested objects
//         } else if (getType(value) === "array") {
//           parseArray(value); // Recursively parse nested arrays
//         } else {
//           result.push({
//             key: key, // Use the current key without parent prefix
//             value: String(value),
//             type: getValueType(value),
//           });
//         }
//       }
//     }
//   };

//   const parseArray = (arr: any[]) => {
//     arr.forEach((item, index) => {
//       if (getType(item) === "object") {
//         parseObject(item); // Recursively parse nested objects
//       } else if (getType(item) === "array") {
//         parseArray(item); // Recursively parse nested arrays
//       } else {
//         result.push({
//           key: String(index), // Use the array index as the key
//           value: String(item),
//           type: getValueType(item),
//         });
//       }
//     });
//   };

//   if (getType(data) === "object") {
//     parseObject(data);
//   } else if (getType(data) === "array") {
//     parseArray(data);
//   }

//   return result;
// };

// // map for  Table Data
// export const parseData = (
//   data: any
// ): { keys: string[]; values: { [key: string]: string }[] } => {
//   const result: { [key: string]: string }[] = [];
//   const headers = new Set<string>();

//   const getType = (item: any) => {
//     return Object.prototype.toString.call(item).slice(8, -1).toLowerCase();
//   };

//   const parseObject = (obj: any) => {
//     const parsedObj: { [key: string]: string } = {};
//     for (const key in obj) {
//       if (Object.hasOwnProperty.call(obj, key)) {
//         const value = obj[key];
//         headers.add(key); // Add key to headers set
//         parsedObj[key] = String(value);
//       }
//     }
//     result.push(parsedObj); // Push parsed object to result
//   };

//   if (getType(data) === "array" && data.length > 0) {
//     data.forEach((item: any) => {
//       if (getType(item) === "object") {
//         parseObject(item);
//       }
//     });
//   } else if (getType(data) === "object") {
//     parseObject(data);
//   }

//   return {
//     keys: Array.from(headers), // Return all headers as an array
//     values: result, // Return parsed values for each object
//   };
// };
