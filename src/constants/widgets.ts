export enum WidgetType {
  BasicWidget = "basicWidget",
  Table = "table",
  LeftPanel = "leftPanel",
  NavBar = "navBar",
  Form = "form",
  List = "list",
  Modal = "modal",
  Card = "card",
  Chart = "chart",
}

export const widgetOptions = Object.entries(WidgetType).map(([key, value]) => ({
  value,
  label: key,
}));
