import { ComponentTypes } from "@constants/ComponentTypes";
import { DatabaseType } from "@constants/databases";
import { InputTypes } from "@constants/inputTypeOptions";
import { ComponentSizes } from "@constants/sizes";
import { WidgetType } from "@constants/widgets";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Action,
  DashboardState,
  Field,
  FieldData,
  PaginationPosition,
} from "src/types/interfaces";
// Define an Option type for dropdown options

// Define the initial state using the defined types
const INITIAL_STATE: DashboardState = {
  fieldData: {
    data: [
      {
        sourceName: "",
        displayName: "",
        dataType: "",
        value: "",
        defaultValue: "",
        row: 1,
        column: 1,
        span: 1,
        maxLength: 20,
        minLength: 0,
        dateFormat: "MM/dd/yyyy",
        copyable: true,
        hidden: false,
        includeSpecialCharacters: true,
        validation: "alphanumeric",
        prefix: "",
        prefixAlignment: "left",
        Precision: 2,
        inputType: "",
        options: [{ label: "Option 1", value: "option1" }], // Only for dropdown type fields
        selectionMode: "", // Only for dropdown type fields
        setAsTitle: false,
        setAsDescription: false,
        setAsExtra: false,
      },
    ],
    pagination: true,
    searchOption: false,
    paginationPosition: "bottomRight",
    avatar: false,
    widgetTitle: "",
    columnsPerRow: 3,
    widgetType: WidgetType.BasicWidget,
    darkMode: false,
    editable: false,
    collapsible: false,
    navBar: {
      size: ComponentSizes.MEDIUM,
      centered: false,
      type: ComponentTypes.LINE,
    },
    card: {
      title: [""],
      description: [""],
      imageUrl: "",
    },
  },
  includeDDLCommands: false,
  actions: {
    save: { text: "Save", color: "primary", type: "primary", url: "https://" },
    edit: { text: "Edit", color: "primary", type: "primary", url: "" },
    cancel: { text: "Cancel", color: "primary", type: "default", url: "" },
  },
  formAction: {
    submit: {
      text: "Save",
      color: "primary",
      type: "primary",
      url: "https://",
    },
  },
  primaryColor: "#139696",
  database: DatabaseType.MYSQL,
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: INITIAL_STATE,

  reducers: {
    // Set the entire field data
    setFieldData(state, action: PayloadAction<FieldData>) {
      state.fieldData = {
        ...state.fieldData,
        data: action.payload.data,
      };
    },
    updateFieldData(state, action: PayloadAction<Field[]>) {
      state.fieldData.data = action.payload;
    },
    // Update specific field by index
    updateField(
      state,
      action: PayloadAction<{ index: number; field: Partial<Field> }>
    ) {
      const { index, field } = action.payload;

      if (index >= 0 && index < state.fieldData.data.length) {
        state.fieldData.data[index] = {
          ...state.fieldData.data[index],
          ...field,
        };
      }
    },

    // Add a new field
    addField(state, action: PayloadAction<Field>) {
      state.fieldData.data.push(action.payload);
    },

    // Remove a field by index
    removeField(state, action: PayloadAction<number>) {
      state.fieldData.data = state.fieldData.data.filter(
        (_, idx) => idx !== action.payload
      );
    },

    // Update widget title
    updateWidgetTitle(state, action: PayloadAction<string>) {
      state.fieldData.widgetTitle = action.payload;
    },

    // Update widget type
    updateWidgetType(state, action: PayloadAction<WidgetType>) {
      state.fieldData.widgetType = action.payload;
    },
    updatePaginationPosition(state, action: PayloadAction<PaginationPosition>) {
      state.fieldData.paginationPosition = action.payload;
    },
    // Toggle dark mode
    toggleDarkMode(state) {
      state.fieldData.darkMode = !state.fieldData.darkMode;
    },
    toggleEditMode(state) {
      state.fieldData.editable = !state.fieldData.editable;
    },
    toggleCollapseMode(state) {
      state.fieldData.collapsible = !state.fieldData.collapsible;
    },
    togglePagination(state) {
      state.fieldData.pagination = !state.fieldData.pagination;
    },
    toggleAvatar(state) {
      state.fieldData.avatar = !state.fieldData.avatar;
    },
    toggleSearchOption(state) {
      state.fieldData.searchOption = !state.fieldData.searchOption;
    },
    toggleNavBarCentered(state) {
      if (state.fieldData.navBar) {
        state.fieldData.navBar.centered = !state.fieldData.navBar?.centered;
      }
    },
    updateNavbarSize(state, action) {
      if (state.fieldData.navBar) {
        state.fieldData.navBar.size = action.payload;
      }
    },
    updateNavBarType(state, action) {
      if (state.fieldData.navBar) {
        state.fieldData.navBar.type = action.payload;
      }
    },
    updateCardTitle(state, action) {
      if (state.fieldData.card) {
        state.fieldData.card.title = action.payload;
      }
    },
    updateCardDescription(state, action) {
      if (state.fieldData.card) {
        state.fieldData.card.description = action.payload;
      }
    },
    updateCardImage(state, action) {
      if (state.fieldData.card) {
        state.fieldData.card.imageUrl = action.payload;
      }
    },
    toggleIncludeDDLCommands(state) {
      state.includeDDLCommands = !state.includeDDLCommands;
    },
    setDatabase(state, action) {
      state.database = action.payload;
    },
    // Reducer to update maxColumnsPerRow
    setColumnsPerRow(state, action: PayloadAction<number>) {
      state.fieldData.columnsPerRow = action.payload;
    },
    updateAction(
      state,
      action: PayloadAction<{
        actionName: keyof DashboardState["actions"]; // Only "save", "edit", or "cancel" allowed
        newAction: Partial<Action>;
      }>
    ) {
      const { actionName, newAction } = action.payload;
      state.actions[actionName] = {
        ...state.actions[actionName],
        ...newAction,
      };
    },
    updateFormAction(
      state,
      action: PayloadAction<{
        actionName: keyof DashboardState["formAction"];
        newAction: Partial<Action>;
      }>
    ) {
      const { actionName, newAction } = action.payload;
      state.formAction[actionName] = {
        ...state.formAction[actionName],
        ...newAction,
      };
    },
    UpdateDropdownOptions(
      state,
      action: PayloadAction<{
        fieldIndex: number; // Index of the field to update
        newOptions: { label: string; value: string }[]; // New dropdown options
      }>
    ) {
      const { fieldIndex, newOptions } = action.payload;
      console.log(newOptions, "options updated");

      const field = state.fieldData.data[fieldIndex];
      if (field && field.inputType === InputTypes.Dropdown) {
        field.options = newOptions;
      }
    },
  },
});

// Export the actions and reducer
export const {
  setFieldData,
  updateField,
  addField,
  removeField,
  updateWidgetTitle,
  updateWidgetType,
  toggleDarkMode,
  updateFieldData,
  toggleEditMode,
  toggleCollapseMode,
  toggleIncludeDDLCommands,
  togglePagination,
  setDatabase,
  updateAction,
  setColumnsPerRow,
  updatePaginationPosition,
  toggleSearchOption,
  toggleAvatar,
  updateFormAction,
  UpdateDropdownOptions,
  toggleNavBarCentered,
  updateNavbarSize,
  updateNavBarType,
  updateCardTitle,
  updateCardDescription,
  updateCardImage,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;
