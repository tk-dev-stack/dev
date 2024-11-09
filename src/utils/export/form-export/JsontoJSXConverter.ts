import { emailRegex, zipCodeRegex } from "@constants/regex";
import _ from "lodash";
import { toPascalCase } from "@utils/functions";
import { Action, ComponentSchema, JSONSchema } from "src/types/interfaces";
import { InputTypes } from "@constants/inputTypeOptions";

const getInputComponent = (
  type: string,
  value: string,
  dateFormat: string,
  copyable: boolean,
  maxLength: number,
  minLength: number,
  prefix: string,
  defaultValue: string,
  Precision: number,
  label: string,
  inputType: string,
  options: any,
  selectionMode: string
) => {
  console.log(
    type,
    dateFormat,
    copyable,
    maxLength,
    minLength,
    prefix,
    defaultValue,
    Precision
  );
  if (inputType === InputTypes.Date) {
    return `<Form.Item   label="${label}"
                name="${label}">
        <DatePicker
          placeholder="Select date"
          size="middle"
          format={${dateFormat}}
        />
      </Form.Item>`;
  } else if (inputType === InputTypes.Number) {
    return `   <Form.Item label="${label}">
        <InputNumber
          maxLength={${maxLength}}
          defaultValue={${value}}
          precision={${Precision}}
          type="number"
          placeholder=""
          size="middle"
      
        />
      </Form.Item>`;
  } else if (inputType === InputTypes.Email) {
    return ` <Form.Item label="${label}"
        rules={[
          {
            required: false,
            warningOnly: false,
            message: "Enter a valid email",
            pattern: ${emailRegex},
          },
        ]}
      >
        <Input maxLength={${maxLength}}  placeholder="Enter email" size="middle" />
      </Form.Item>`;
  } else if (inputType === InputTypes.ZipCode) {
    return ` <Form.Item
    label="${label}"
        rules={[
          {
            required: true,
            warningOnly: false,
            message: "Enter a valid zip code",
            pattern: ${zipCodeRegex},
          },
        ]}
      >
        <Input maxLength={${maxLength}}  placeholder="Enter zip code" size="middle" />
      </Form.Item>`;
  } else if (inputType === InputTypes.Textarea) {
    return ` <Form.Item
    label="${label}"
    name="${label}"
      >
        <Input.TextArea maxLength={${maxLength}}  placeholder="Enter ${label}" size="middle" />
      </Form.Item>`;
  } else if (inputType === InputTypes.Password) {
    return ` <Form.Item
    label="${label}"
    name="${label}"  
      >
        <Input.Password maxLength={${maxLength}}  placeholder="Enter password" size="middle" />
      </Form.Item>`;
  } else if (inputType === InputTypes.Text) {
    return ` <Form.Item
    label="${label}"
    name="${label}"
      
      >
        <Input maxLength={${maxLength}}  placeholder="Enter password" size="middle" />
      </Form.Item>`;
  } else if (inputType === InputTypes.Dropdown) {
    return ` <Form.Item
    label="${label}"
    name="${label}"
      >
  <Select
          placeholder="Select true or false"
          size="middle"
          mode="${selectionMode}"
        >
         ${
           options && options.length > 0
             ? options
                 .map(
                   (option: any) =>
                     `<Select.Option value="${option.value}">${option.label}</Select.Option>`
                 )
                 .join("")
             : `<Select.Option value="default">No options available</Select.Option>`
         }
        </Select>
      </Form.Item>`;
  } else if (inputType === InputTypes.Checkbox) {
    return `  <Form.Item
    label="${label}"   name="${label}"
      >
       <Checkbox/>
      </Form.Item>`;
  } else {
    return `  <Form.Item
    label="${label}"
      >
        <Input maxLength={${maxLength}}  placeholder="" size="middle" />
      </Form.Item>`;
  }
};

const generateAntDesignFormJSX = (components: ComponentSchema[]) => {
  const layout: { [key: string]: ComponentSchema[] } = {};

  components.forEach((component) => {
    const { props } = component;
    const row = props.row ?? 1;
    const column = props.column ?? 1;

    if (!layout[row]) {
      layout[row] = [];
    }
    layout[row].push({ ...component, column });
  });

  return Object.entries(layout)
    .map(([row, componentsInRow]) => {
      const cols = componentsInRow
        .map((component, index) => {
          const { props } = component;
          const { displayName } = props;
          const inputComponent = getInputComponent(
            component.type as string,
            _.camelCase(displayName),
            component.validations.dateFormat || "yyyy-MM-dd",
            component.props.copyable || false,
            component.validations.maxLength,
            component.validations.minLength,
            component.formatting.prefix || "",
            component.validations.defaultValue,
            component.formatting.Precision ?? 0,
            component.label || "",
            component.props.inputType!,
            component.props.options,
            component.props.selectionMode || ""
          );
          return `
          <Col span={${props.span}} key={${index}}>
          ${inputComponent}
          </Col>
          `;
        })
        .join("");

      return `
          <Row gutter={16} key="${row}">${cols}</Row>
        `;
    })
    .join("");
};

export function exportForm(json: JSONSchema, formButtonStyles: Action): string {
  const { components, title, theme } = json;
  const { text, type } = formButtonStyles;
  const widgetName = toPascalCase(title);
  const useStateHooks = components
    .map(
      ({ props, value }) =>
        `const [${_.camelCase(props.displayName)}, set${toPascalCase(
          props.displayName!
        )}] = useState(${
          typeof value === "string" ? JSON.stringify(value) : value || ""
          // JSON.stringify(value)
        });`
    )
    .join("\n");
  const componentJsx = generateAntDesignFormJSX(components);
  const themeClass = theme ? "darkTheme" : "lightTheme";
  const colorBgContainer = theme ? "#333" : "#fff";
  const colorTextBase = theme ? "#fff" : "#000";
  const colorTextSecondary = theme ? "#b0b0b0" : "#595959";
  const colorBorder = theme ? "#444" : "#d9d9d9";
  const colorBgElevated = theme ? "#333" : "#fff";
  const colorText = theme ? "#fff" : "#000";
  return `
import React,{ useState } from 'react';
import '../../styles/${json.widgetType}.css'
import {Input, Button, Row, Col, Form, DatePicker, InputNumber, Select,ConfigProvider } from "antd";

const ${widgetName} = () => {
 ${useStateHooks}

  const handleFinish = (values) => {
    console.log("Form submitted with values: ", values);
 };
return (
<ConfigProvider 
  theme={{
     token:{
      colorBgContainer:"${colorBgContainer}",
      colorTextBase:"${colorTextBase}",
      colorTextSecondary:"${colorTextSecondary}",
      colorBorder:"${colorBorder}",
      colorBgElevated:"${colorBgElevated}",
      colorText:"${colorText}",

      } 
   }}
  >
  <div className="container ${themeClass}">
  <div className="heading">${title}</div>
   <Form layout="vertical" onFinish={handleFinish}>
        ${componentJsx}
        <Row  justify="end" >
        <Col>
          <Form.Item>
            <Button type="${type}" htmlType="submit" variant="">
             ${text}
            </Button>
          </Form.Item>
        </Col>
      </Row>
   </Form>
  </div>
</ConfigProvider>
);
};
export default ${widgetName};`;
}
