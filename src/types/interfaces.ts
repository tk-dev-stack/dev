import { ComponentTypes } from "@constants/ComponentTypes";
import { DatabaseType } from "@constants/databases";
import { ComponentSizes } from "@constants/sizes";
import { Libraries } from "@constants/ui-libraries";
import { WidgetType } from "@constants/widgets";

export type PaginationPosition =
  | "topLeft"
  | "topRight"
  | "topCenter"
  | "bottomLeft"
  | "bottomRight"
  | "bottomCenter";
export interface Field {
  sourceName: string;
  displayName: string;
  dataType: string;
  value: string | Date | number | boolean;
  defaultValue: string;
  row: number;
  column: number;
  span: number;
  maxLength: number;
  minLength: number;
  dateFormat: string;
  copyable: boolean;
  hidden: boolean;
  includeSpecialCharacters: boolean;
  validation: string;
  prefix: string;
  prefixAlignment: string;
  className?: string;
  Precision: number;
  inputType?: string;
  options?: Option[];
  selectionMode: string;
  setAsTitle: boolean; //set as title of a list or card etc.
  setAsDescription: boolean; //set as description of a list or a card.
  setAsExtra: boolean; // set as the extra of a list or a card.
}

export interface FieldData {
  data: Field[];
  widgetTitle: string;
  widgetType: WidgetType;
  darkMode: boolean;
  editable: boolean;
  pagination: boolean;
  paginationPosition: PaginationPosition;
  collapsible: boolean;
  avatar: boolean;
  searchOption: boolean;
  columnsPerRow: number;
  navBar?: NavBar;
  card?: CardProps;
}

export type CardProps = {
  title: string[];
  description: string[];
  imageUrl: string;
};

export type NavBar = {
  size: ComponentSizes;
  centered: boolean;
  type: ComponentTypes;
};
export interface Action {
  text: string;
  color: string;
  type: string;
  url: string;
}
export interface Option {
  label: any;
  value: any;
}
export interface DashboardState {
  fieldData: FieldData;
  includeDDLCommands: boolean;
  database?: DatabaseType;
  actions: { save: Action; edit: Action; cancel: Action };
  formAction: { submit: Action };
  primaryColor: string;
}

export interface ComponentSchema {
  type?: string;
  dataType?: string | number | boolean;
  value: string | number | Date | boolean;
  editable: boolean;
  props: Partial<Field>;
  validations: {
    dateFormat?: string;
    maxLength: number;
    minLength: number;
    specialCharacters: boolean;
    validationType: string;
    defaultValue: any;
  };
  formatting: {
    prefix?: string;
    Precision?: number;
  };
  label?: string;
  column?: string | number;
}

export interface JSONSchema {
  library: Libraries;
  title: string;
  widgetType: string;
  components: ComponentSchema[];
  buttonText?: string;
  buttonPosition?: string;
  theme?: boolean;
}
