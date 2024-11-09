import { toPascalCase } from "@utils/functions";
import { JSONSchema } from "src/types/interfaces";

function generateAntDesignTableJSX() {
  return `
    <Table 
      dataSource={dataSource}
      column={columns} 
      rowKey={(record) => record.key}
    />
  `;
}

export function exportTable(json: JSONSchema): string {
  const { components, title } = json;
  const widgetName = toPascalCase(title);
  const componentJsx = generateAntDesignTableJSX();

  const columns = components
    .map((component) => {
      const { props } = component;
      return `
        {
          title: '${props.displayName}',
          dataIndex: '${props.displayName}',
          key: '${props.displayName}',
        }
      `;
    })
    .join(",\n");
  const columnValues = `const columns = ${columns}`;

  return `
import React from 'react';
import '../../styles/${json.widgetType}.css'
import {Input, Button, Row, Col} from "antd";

const ${widgetName} = () => {
${columnValues}

return (
  <div className="container">
  <div className="heading">${title}</div>
    ${componentJsx}
  </div>
);
};
export default ${widgetName};`;
}
