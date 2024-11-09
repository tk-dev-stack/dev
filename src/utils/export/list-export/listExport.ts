import _ from "lodash";
import { JSONSchema } from "src/types/interfaces";

function generateAntDesignListJSX(): string {
  return `
    <List
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={(item,index)=>(
             <List.Item>
            <List.Item.Meta
              avatar={
                fieldData.avatar ? (
                  <Avatar
                   
                  />
                ) : null
              }
              title={item.title}
              description={item.description as string}
            />
          </List.Item>
        )}
    />
  `;
}

export function exportList(json: JSONSchema): string {
  const { components, title } = json;
  const widgetName = _.camelCase(title);
  const componentJsx = generateAntDesignListJSX();

  const columns = components
    .map((component) => {
      const { props } = component;
      return `
        {
          title: '${props.displayName}',
          description:'${props.displayName}'
        }
      `;
    })
    .join(",\n");
  const columnValues = `const dataSource = ${columns}`;

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
