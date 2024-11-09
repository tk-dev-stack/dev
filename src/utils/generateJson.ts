import {
  ComponentSchema,
  Field,
  FieldData,
  JSONSchema,
} from "../types/interfaces";
import { Libraries } from "@constants/ui-libraries";

export function generateJSONFromFormObject(
  widgetConfig: FieldData
): JSONSchema {
  //handle basic widget
  // if (widgetConfig.widgetType === WidgetType.BasicWidget) {
  const components = generateBasicWidgetComponents(widgetConfig);
  return {
    library: Libraries.antDesign,
    title: widgetConfig.widgetTitle,
    widgetType: widgetConfig.widgetType,
    theme:widgetConfig.darkMode,
    components: components,
  };
  // }
  //   if (widgetConfig.widgetType === WidgetType.Table) {
  //     console.log("table");
  //     const components = generateTableWidgetComponents(widgetConfig.data);
  //     return {
  //       library: "Ant Design",
  //       title: widgetConfig.widgetTitle,
  //       widgetType: widgetConfig.widgetType,
  //       components: components,
  //     };
  //   }
  //   if (widgetConfig.widgetType === WidgetType.Form) {
  //     console.log("form");
  //     const components = generateFormWidgetComponents(widgetConfig.data);
  //     return {
  //       library: "Ant Design",
  //       title: widgetConfig.widgetTitle,
  //       widgetType: widgetConfig.widgetType,
  //       components: components,
  //     };
  //   }

  //   if (widgetConfig.widgetType === WidgetType.LeftPanel) {
  //     const components = generateLeftPanelComponents(widgetConfig.data);
  //     if (widgetConfig.data)
  //       return {
  //         library: "Ant Design",
  //         title: widgetConfig.widgetTitle,
  //         widgetType: widgetConfig.widgetType,
  //         components: components,
  //       };
  //   }
  throw new Error(`Unsupported widget type: ${widgetConfig.widgetType}`);
}

// const generateLeftPanelComponents = (fields: Field | Field[]) => {
//   return {
//     type: "leftPanel",
//     props: {
//       itemTitle: fields.itemTitle,
//       itemDescription: fields.itemDescription,
//       itemExtra: fields.itemExtra,
//       onClick: fields.onClick,
//     },
//   };
// };

// const generateTableWidgetComponents = (fields: Field[] | Field) => {
//   console.log("fields", fields);
//   if (fields.length > 0) {
//     const columns = fields.map((field) => {
//       return {
//         type: field.dataType,
//         props: {
//           title: field.fieldName,
//           dataIndex: field.fieldName,
//           key: field.fieldName,
//         },
//       };
//     });
//     return columns;
//   }
// };

const generateBasicWidgetComponents = (widgetConfig: FieldData) => {
  const fields = widgetConfig.data;
  const columnsPerRow = widgetConfig.columnsPerRow;
  const dataTypeToComponentType: { [key: string]: string } = {
    string: "Input",
    date: "DatePicker",
    number: "InputNumber",
    boolean: "Checkbox",
  };
  const rowGroups: { [key: string]: Field[] } = {};
  fields.forEach((field: Field) => {
    if ("row" in field) {
      if (!rowGroups[field.row]) {
        rowGroups[field.row] = [];
      }
      rowGroups[field.row].push(field);
    }
  });
  const components = fields
    .filter((field) => !field.hidden)
    .map((field): ComponentSchema => {
      const { sourceName, dataType, defaultValue, inputType } = field;
      const row = "row" in field ? field.row : 1;
      const column = "column" in field ? field.column : 1;

      const componentType = dataTypeToComponentType[dataType] || "Input";

      //  const columnSpan = Math.floor(24 / columnsPerRow);
      //  const span = (field?.span ) * columnSpan;
      const span = field ? field.span * (24 / columnsPerRow) : 0;

      let className;
      switch (componentType) {
        case "Input":
          className = "inputField";
          break;
        case "DatePicker":
          className = "datePicker";
          break;
        case "InputNumber":
          className = "inputNumber";
          break;
        default:
          className = "";
      }

      return {
        type: field.dataType,
        editable: widgetConfig.editable,
        value: field.value || "",
        validations: {
          dateFormat: field.dateFormat,
          maxLength: field.maxLength,
          minLength: field.minLength,
          specialCharacters: field.includeSpecialCharacters,
          validationType: field.validation,
          defaultValue: defaultValue,
        },
        formatting: {
          prefix: field.prefix,
          Precision: field.Precision,
        },
        props: {
          className,
          inputType: inputType || "text",
          displayName: field.displayName,
          row: row,
          column: column,
          maxLength: field.maxLength,
          options:field.options,
          selectionMode:field.selectionMode,
          span,
          ...(field.copyable ? { copyable: true } : {}),
        },
        label: sourceName,
      };
    });
  return components;
};

// const generateFormWidgetComponents = (fields: Field[]) => {
//   const dataTypeToComponentType: { [key: string]: string } = {
//     string: "Input",
//     date: "DatePicker",
//     number: "InputNumber",
//     boolean: "Checkbox",
//   };

//   // Group fields by row for layout purposes
//   const rowGroups: { [key: string]: Field[] } = {};
//   fields.forEach((field: Field) => {
//     if ("row" in field) {
//       if (!rowGroups[field.row!]) {
//         rowGroups[field.row!] = [];
//       }
//       rowGroups[field.row!].push(field);
//     }
//   });

//   // Map fields to generate the form components
//   const components = fields.map((field): ComponentSchema => {
//     const { fieldName, dataType, defaultValue, required } = field as Field;
//     const row = "row" in field ? field.row : "1";
//     const column = "column" in field ? field.column : "1";

//     const componentType = dataTypeToComponentType[dataType] || "Input";

//     // Number of fields in the current row
//     const fieldsInRow = row ? rowGroups[row].length : 1;
//     const span = Math.floor(24 / fieldsInRow); // Calculate span for layout

//     let className;
//     switch (componentType) {
//       case "Input":
//         className = "formInputField";
//         break;
//       case "DatePicker":
//         className = "formDatePicker";
//         break;
//       case "InputNumber":
//         className = "formInputNumber";
//         break;
//       case "Checkbox":
//         className = "formCheckbox";
//         break;
//       default:
//         className = "";
//     }

//     // Validation rules (e.g., required fields)
//     const validationRules = required
//       ? [{ required: true, message: `${fieldName} is required` }]
//       : [];

//     return {
//       type: componentType,
//       props: {
//         value: defaultValue || "",
//         className,
//         row: parseInt(row!, 10),
//         column: parseInt(column!, 10),
//         span,
//         fieldName,
//         required,
//         rules: validationRules,
//       },
//       label: fieldName,
//     };
//   });

//   return components;
// };
