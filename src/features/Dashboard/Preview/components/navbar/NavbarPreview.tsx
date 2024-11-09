import React from "react";
import styles from "./Navbar.module.scss";
import { FieldData } from "src/types/interfaces";
import { Skeleton, Tabs, TabsProps } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { TabsType } from "antd/es/tabs";

interface NavbarPreviewProps {
  fieldData: FieldData;
}

const NavbarPreview: React.FC<NavbarPreviewProps> = ({ fieldData }) => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const iitems: TabsProps["items"] = fieldData.data.map((item, index) => {
    return {
      key: index,
      label: item.displayName,
      //   children: `contents of ${item.displayName}`,
      children: <Skeleton avatar paragraph={{ rows: 4 }} />,
    };
  });

  return (
    <div>
      <Tabs
        type={fieldData.navBar?.type as TabsType}
        size={fieldData.navBar?.size as SizeType}
        defaultActiveKey="1"
        items={iitems}
        onChange={onChange}
      />
    </div>
  );
};

export default NavbarPreview;
