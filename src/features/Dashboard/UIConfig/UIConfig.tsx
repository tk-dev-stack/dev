import React, { Suspense } from "react";
import "./UIconfig.scss";
import { Tabs, TabsProps } from "antd";
const Styling = React.lazy(() => import("./components/Styling/Styling"));
const Mapping = React.lazy(() => import("./components/Mapping/Mapping"));
const Validation = React.lazy(
  () => import("./components/Validation/Validation")
);
const Formatting = React.lazy(
  () => import("./components/Formatting/Formatting")
);
const Actions = React.lazy(() => import("./components/Actions/Actions"));

type UIConfigPropsType = {};
const UIConfig: React.FC<UIConfigPropsType> = ({}) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Basic",
      children: (
        <Suspense fallback={<div>Loading ...</div>}>
          <Styling />,
        </Suspense>
      ),
    },
    {
      key: "2",
      label: "Mapping",
      children: (
        <Suspense fallback={<div>Loading ...</div>}>
          <Mapping />,
        </Suspense>
      ),
    },
    {
      key: "3",
      label: "Validation",
      children: (
        <Suspense fallback={<div>Loading ...</div>}>
          <Validation />,
        </Suspense>
      ),
    },
    {
      key: "4",
      label: "Formatting",
      children: (
        <Suspense fallback={<div>Loading ...</div>}>
          <Formatting />,
        </Suspense>
      ),
    },
    {
      key: "5",
      label: "Actions",
      children: (
        <Suspense fallback={<div>Loading ...</div>}>
          <Actions />,
        </Suspense>
      ),
    },
    {
      key: "6",
      label: "Theme",
      children: (
        <Suspense fallback={<div>Loading ...</div>}>
          {/* <Actions />, */}
        </Suspense>
      ),
    },
  ];

  return (
    <div className="uiconfig__container">
      <div className="uiconfig__tab_container">
        <Tabs type="card" defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default UIConfig;
