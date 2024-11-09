import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import type { TreeProps } from "antd";
import { useDispatch } from "react-redux";
import { updateFieldData } from "src/Redux/Dashboard/dashboard.reducer";
import { Field } from "src/types/interfaces";
import parseJSONToAntTree from "@utils/parseJSONToAntTree";

type AntTreeNode = {
  title: string;
  key: string;
  children?: AntTreeNode[];
};

interface TreeAntProps {
  apiResponse: any;
}

const TreeView: React.FC<TreeAntProps> = ({ apiResponse }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<AntTreeNode[]>();
  const [values, setValues] = useState<Map<string, any>>();

  useEffect(() => {
    const treeFormatData = parseJSONToAntTree(apiResponse);
    setData(treeFormatData.treeData);
    console.log(treeFormatData.treeData);
    setValues(treeFormatData.valuesMap);
  }, [apiResponse]);

  function transformData(inputArray: any): Field[] {
    return inputArray.map((item: string, index: number) => {
      const itemValue = values?.get(item);
      const key = item.split(".").pop(); // Extract the key, e.g., "id", "name", etc.

      return {
        sourceName: key,
        displayName: key,
        dataType: typeof key === "number" ? "decimal" : "string",
        value: itemValue, // Placeholder, actual value may be assigned based on further input
        defaultValue: "",
        row: 1,
        column: index + 1,
        span: 1,
        maxLength: 20,
        minLength: 2,
        dateFormat: "MM/dd/yyyy",
        copyable: false,
        hidden: false,
        includeSpecialCharacters: false,
        validation: "alphanumeric",
        prefix: "",
        prefixAlignment: "left",
        Precision: 2,
        inputType: "",
      };
    });
  }

  const onCheck: TreeProps["onCheck"] = (checkedKeys) => {
    const data1 = transformData(checkedKeys);
    dispatch(updateFieldData(data1));
  };

  return (
    <Tree
      defaultExpandedKeys={["root.root"]}
      showLine
      checkable
      onCheck={onCheck}
      treeData={data}
    />
  );
};

export default TreeView;
