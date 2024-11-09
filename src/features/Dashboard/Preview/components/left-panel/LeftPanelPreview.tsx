import React from "react";
import styles from "./LeftPanel.module.scss";
import { Avatar, Button, List, Typography } from "antd";
import { FieldData } from "src/types/interfaces";
import SearchBar from "@components/Search/SearchBar";
import { RootState } from "src/Redux/store";
import theme from "../../CommonStyles/ThemeStyles.module.scss";
import { useSelector } from "react-redux";
import { MenuOutlined, MoreOutlined } from "@ant-design/icons";
interface ListPreviewProps {
  fieldData: FieldData;
}

const LeftPanelPreview: React.FC<ListPreviewProps> = ({ fieldData }) => {
  const [expand, setExpand] = React.useState(true);
  const { darkMode } = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const themeClass = darkMode ? theme.darkTheme : theme.lightTheme;
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

  const handleExpand = (val: boolean) => {
    setExpand(val);
  };

  const handleMore = () => {
    //TODO:
  };

  return (
    <div
      style={{ width: expand ? "100%" : "70px" }}
      className={`${styles.container} ${themeClass}`}
    >
      {expand ? (
        <List
          className={styles.navListContainer}
          itemLayout="horizontal"
          dataSource={data}
          header={
            <div className={styles.navListMainHeader}>
              <div className={styles.navListExpandIcon}>
                <MenuOutlined onClick={() => handleExpand(false)} />
              </div>
              {fieldData.searchOption && (
                <div className={styles.header__searchbar}>
                  <SearchBar />
                </div>
              )}
            </div>
          }
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  onClick={handleMore}
                  type="text"
                  icon={<MoreOutlined />}
                />,
              ]}
            >
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
      ) : (
        <div className={styles.navListCollapsedContainer}>
          <div className={styles.navListCollapsedIcon}>
            <MenuOutlined onClick={() => handleExpand(true)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanelPreview;
