import React from "react";
import "./DataConfig.scss";
import FieldForm from "./FieldForm/FieldForm";
import ApiSearchInput from "./ApiForm";
import { useDispatch } from "react-redux";
import { fetchData as fetchDataAction } from "src/Redux/Apislice/api.actions";
import TreeAnt from "@components/TreeView/Tree";
import { useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import { parseData } from "@utils/parseData";
import { Tabs, TabsProps } from "antd";

interface parsedData {
  key: string;
  value: string;
  type: string;
}

import { AppDispatch } from "src/Redux/store";
import { sampleApi } from "@constants/sampleApis";
import { WidgetType } from "@constants/widgets";
type DataConfigProps = {};
const DataConfig: React.FC<DataConfigProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchData = (url: string) => {
    dispatch(fetchDataAction(url));
  };

  const apidata = useSelector((state: RootState) => state.api.data);
  const parsedData: parsedData[] = parseData(apidata);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tree View",
      children: <TreeAnt apiResponse={apidata} />,
    },
    {
      key: "2",
      label: "List View",
      children: <FieldForm parsedData={parsedData} />,
    },
  ];

  return (
    <div className="dataconfig__container">
      <div className="dataconfig__search--btn">
        <ApiSearchInput fetchData={fetchData} sampleApi={sampleApi} />
      </div>
      <Tabs type="card" defaultActiveKey="1" items={items} />
    </div>
  );
};

export default DataConfig;
