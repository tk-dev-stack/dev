import styles from "./TablePreview.module.scss";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { FieldData } from "src/types/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import SearchBar from "@components/Search/SearchBar";

interface TablePreviewProps {
  fieldData: FieldData;
}

const TablePreview: React.FC<TablePreviewProps> = ({ fieldData }) => {
  const [columns, setColumns] = useState([
    { title: "", dataIndex: "", key: "", ellipsis: true, editable: true },
  ]);
  const [data, setData] = useState<any>();
  const isPagination = useSelector(
    (state: RootState) => state.dashboard.fieldData.pagination
  );
  const paginationPosition = useSelector(
    (state: RootState) => state.dashboard.fieldData.paginationPosition
  );

  const isHidden = (column: string) => {
    const [field] = fieldData.data.filter((item) => item.sourceName === column);
    return field.hidden;
  };

  useEffect(() => {
    if (fieldData) {
      const arr = fieldData.data;
      const uniqueSourceNames = Array.from(
        new Set(arr.map((item) => item.sourceName))
      );
      setColumns(
        uniqueSourceNames.map((columnName) => {
          return {
            title: columnName,
            dataIndex: columnName,
            key: columnName,
            ellipsis: true,
            editable: true,
            hidden: isHidden(columnName),
          };
        })
      );
      setData(transformToObject(arr));
      //   const chunkSize = uniqueSourceNames.length;
    }
  }, [fieldData]);

  //   let pagination: TablePaginationConfig;
  //   const pagination = { position: [paginationPosition] };
  //   const arr = fieldData.data;
  //   const uniqueSourceNames = Array.from(
  //     new Set(arr.map((item) => item.sourceName))
  //   );
  //   //   const chunkSize = uniqueSourceNames.length;

  //   const columns = uniqueSourceNames.map((columnName) => {
  //     return {
  //       title: columnName,
  //       dataIndex: columnName,
  //       key: columnName,
  //       ellipsis: true,
  //       editable: true,
  //     };
  //   });

  function transformToObject(inputArray: any) {
    // let result: { [key: string]: any }={};
    const result: { [key: string]: any } = {};

    for (const item of inputArray) {
      result[item.sourceName] = item.value;
    }
    const array = Array.from({ length: 10 }, () => ({ ...result }));
    return array;
  }

  //   const data = transformToObject(arr);

  return (
    <div className={styles.container}>
      <SearchBar />
      <Table
        pagination={isPagination ? { position: [paginationPosition] } : false}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default TablePreview;
