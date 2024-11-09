import React from "react";
import styles from "./List.module.scss";
import { Avatar, List } from "antd";
import { FieldData } from "src/types/interfaces";
import SearchBar from "@components/Search/SearchBar";
import { RootState } from "src/Redux/store";
import theme from "../../CommonStyles/ThemeStyles.module.scss";
import { useSelector } from "react-redux";
interface ListPreviewProps {
  fieldData: FieldData;
}

const ListPreview: React.FC<ListPreviewProps> = ({ fieldData }) => {
  const { darkMode } = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );

  const themeClass = darkMode ? theme.darkTheme : theme.lightTheme;
  console.log("field data is=", fieldData);
  // const title = fieldData.data.filter((item) => item.setAsTitle);
  // const description = fieldData.data.filter((item) => item.setAsTitle);
  const title = fieldData.data
    .filter((item) => item.setAsTitle)
    .map((obj) => obj.value)
    .join(" ");
  const description = fieldData.data
    .filter((item) => item.setAsDescription)
    .map((obj) => obj.value)
    .join(" ");
  const extra = fieldData.data
    .filter((item) => item.setAsExtra)
    .map((obj) => obj.value)
    .join(" ");

  const data = Array(10).fill({ title, description, extra });
  // const data = [
  //   {
  //     title,
  //     description,
  //     extra,
  //   },
  // ];

  // const data = fieldData.data
  //   .filter((item) => item.hidden === false)
  //   .map((item) => {
  //     return {
  //       title: item.displayName,
  //       description: item.value,
  //     };
  //   });

  return (
    <div className={`${styles.container} ${themeClass}`}>
      <div className="searchBar">{fieldData.searchOption && <SearchBar />}</div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                fieldData.avatar ? (
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                ) : null
              }
              title={item.title}
              description={item.description as string}
            />
            {item.extra}
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListPreview;
