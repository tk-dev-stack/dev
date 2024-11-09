import { ComponentSchema, JSONSchema } from "../../../types/interfaces";
import { toPascalCase } from "../../functions";
import _ from "lodash";
import { DataTypes } from "@constants/dataTypeOptions";
import { emailRegex, zipCodeRegex } from "@constants/regex";

const getInputComponent = (
  type: string,
  value: string,
  dateFormat: string,
  copyable: boolean,
  maxLength: number,
  minLength: number,
  prefix: string,
  defaultValue: string,
  Precision: number
) => {
  console.log(
    dateFormat,
    copyable,
    maxLength,
    minLength,
    prefix,
    defaultValue,
    Precision
  );
  if (type === DataTypes.Date) {
    return `<Form.Item>
        <DatePicker
          defaultValue={${value}}
          placeholder="Select date"
          size="middle"
          format={${dateFormat}}
        />
      </Form.Item>`;
  } else if (type === DataTypes.Integer) {
    return `   <Form.Item>
        <Input
          maxLength={${maxLength}}
          defaultValue={${value}}
          type="number"
          placeholder=""
          size="middle"
        />
      </Form.Item>`;
  } else if (type === DataTypes.Decimal || type === DataTypes.Amount) {
    return `   <Form.Item>
        <InputNumber
          maxLength={${maxLength}}
          defaultValue={${value}}
          precision={${Precision}}
          type="number"
          placeholder=""
          size="middle"
      
        />
      </Form.Item>`;
  } else if (type === DataTypes.Phone) {
    return `<Form.Item>
        <Input
          maxLength={${maxLength}}
          defaultValue={${value}}
          type="number"
          placeholder=""
          size="middle"
        />
      </Form.Item>`;
  } else if (type === DataTypes.Email) {
    return ` <Form.Item
        rules={[
          {
            required: false,
            warningOnly: false,
            message: "Enter a valid email",
            pattern: ${emailRegex},
          },
        ]}
      >
        <Input maxLength={${maxLength}} defaultValue={${value}} placeholder="" size="middle" />
      </Form.Item>`;
  } else if (type === DataTypes.ZipCode) {
    return ` <Form.Item
        rules={[
          {
            required: true,
            warningOnly: false,
            message: "Enter a valid zip code",
            pattern: ${zipCodeRegex},
          },
        ]}
      >
        <Input maxLength={${maxLength}} defaultValue={${value}} placeholder="" size="middle" />
      </Form.Item>`;
  } else if (type === DataTypes.Boolean) {
    return `  <Form.Item
      >
        <Select
          defaultValue={${value}}
          placeholder="Select true or false"
          size="middle"
        >
          <Select.Option value={true}>True</Select.Option>
          <Select.Option value={false}>False</Select.Option>
        </Select>
      </Form.Item>`;
  } else {
    return `  <Form.Item
      >
        <Input maxLength={${maxLength}} defaultValue={${value}} placeholder="" size="middle" />
      </Form.Item>`;
  }
};

const generateAntDesignEditScreen = (components: ComponentSchema[]) => {
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
            component.formatting.Precision ?? 0
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

const generateAntDesignJsx = (components: ComponentSchema[]) => {
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
          const { props, label } = component;
          const { className, displayName } = props;

          return `
              <Col span={${props.span}} key={${index}}>
                <Form.Item labelAlign="left" label="${label}">
                  <Typography.Text copyable={${
                    props.copyable ?? false
                  }} className="${className}">
                    {${_.camelCase(displayName)}}
                  </Typography.Text>
                  
                </Form.Item>
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

export function jsonToJsx(json: JSONSchema): string {
  const { components, title, theme } = json;
  const widgetName = toPascalCase(title);

  // Step 1: Generate useState Hooks for each component with a unique displayName
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
  const collapsed = `const [collapsed,setCollapsed] = useState(false)`;
  const isEditing = `const [isEditing,setIsEditing] = useState(false)`;

  const componentJsx = generateAntDesignJsx(components);
  const editScreen = generateAntDesignEditScreen(components);
  const themeClass = theme ? "darkTheme" : "lightTheme";
  const colorBgContainer = theme ? "#333" : "#fff";
  const colorTextBase = theme ? "#fff" : "#000";
  const colorTextSecondary = theme ? "#b0b0b0" : "#595959";
  const colorBorder = theme ? "#444" : "#d9d9d9";
  return `
import React, { useState } from 'react';
import '../../styles/${json.widgetType}.css'
import { Input, Button, Row, Col, Form, DatePicker, Typography,InputNumber } from 'antd';

const ${widgetName} = () => {
  ${useStateHooks}
  ${collapsed}
  ${isEditing}

  return (
  <ConfigProvider 
  theme={{
     token:{
      colorBgContainer:"${colorBgContainer}",
      colorTextBase:"${colorTextBase}",
      colorTextSecondary:"${colorTextSecondary}",
      colorBorder:"${colorBorder}",
      } 
   }}
  >
    <div className="container ${themeClass}">
      <div className="heading">
      ${title}
      {!isEditing &&
          <Button
          onClick={() => setIsEditing(!isEditing)}
          size="middle"
          color= "primary"
          variant='solid'
          >
          Edit
          </Button>
      }
          {
            isEditing && 
             <div className="button__group">
              <Button
                size="middle"
                color="primary"
                variant="solid"
              >
                Save
              </Button>

              <Button onClick={()=>setIsEditing(false)} type="default" size="middle">
                Cancel
              </Button>
            </div>
          }
      </div>
       {!isEditing?
        <Form layout="vertical">
        ${componentJsx}
        </Form>
        :
        <Form layout="vertical">
        ${editScreen}
        </Form>
        }
    </div>
    </ConfigProvider>
  );
};

export default ${widgetName};
`;
}
