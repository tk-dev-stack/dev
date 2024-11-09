import {
  HighlightOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import "../../UIconfig.scss";
import "./Styling.scss";
import {
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  updateWidgetTitle,
  toggleDarkMode,
  toggleEditMode,
  toggleCollapseMode,
  setColumnsPerRow,
  togglePagination,
  updatePaginationPosition,
  toggleAvatar,
  toggleSearchOption,
  updateFieldData,
  toggleNavBarCentered,
  updateNavbarSize,
  updateNavBarType,
  updateCardTitle,
  updateCardDescription,
  updateCardImage,
} from "src/Redux/Dashboard/dashboard.reducer";
import { RootState } from "src/Redux/store";
import { WidgetType } from "@constants/widgets";
import { CardProps, FieldData, NavBar } from "src/types/interfaces";
import { ComponentSizes, SIZE } from "@constants/sizes";
import { ComponentTypes, NAVBAR_TYPES } from "@constants/ComponentTypes";

type StylingPropsType = {};

const Styling: React.FC<StylingPropsType> = () => {
  const dispatch = useDispatch();

  // Selectors
  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const columnsPerRow = useSelector(
    (state: RootState) => state.dashboard.fieldData.columnsPerRow
  );

  // Handler Functions
  const handleThemeChange = () => dispatch(toggleDarkMode());
  const handleWidgetNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateWidgetTitle(e.target.value));
  const handleCheckboxChange = (action: any) => () => dispatch(action());
  const handleColumnsPerRowChange = (value: number | null) => {
    if (value !== null) dispatch(setColumnsPerRow(value));
  };
  const handleFieldUpdate = (
    selectedFields: string[],
    property: "setAsTitle" | "setAsDescription" | "setAsExtra"
  ) => {
    const updatedFields = fieldData.data.map((field) => ({
      ...field,
      [property]: selectedFields.includes(field.sourceName),
    }));
    dispatch(updateFieldData(updatedFields));
  };
  const handleNavBarCenteredToggle = () => {
    dispatch(toggleNavBarCentered());
    //
  };
  const handleNavBarSizeChange = (size: ComponentSizes) => {
    dispatch(updateNavbarSize(size));
  };
  const handleNavBarTypeChange = (type) => {
    dispatch(updateNavBarType(type));
  };
  const handleCardTitleChange = (titleArray: string[]) => {
    dispatch(updateCardTitle(titleArray));
  };
  const handleCardDescriptionChange = (descriptionArray) => {
    // const description = descriptionArray.join(" ");
    dispatch(updateCardDescription(descriptionArray));
  };
  const handleCardImageChange = (type) => {
    dispatch(updateCardImage(type));
  };

  // Pagination Position Options
  const paginationPositions = [
    { label: "Top Left", value: "topLeft" },
    { label: "Top Center", value: "topCenter" },
    { label: "Top Right", value: "topRight" },
    { label: "Bottom Left", value: "bottomLeft" },
    { label: "Bottom Center", value: "bottomCenter" },
    { label: "Bottom Right", value: "bottomRight" },
  ];

  return (
    <Card className="widget-styling__container" bordered={false}>
      <Form layout="vertical" className="widget-styling__form">
        <WidgetNameInput
          value={fieldData.widgetTitle}
          onChange={handleWidgetNameChange}
        />
        <ThemeSelector
          darkMode={fieldData.darkMode}
          onChange={handleThemeChange}
        />
        <ColumnsInput
          value={columnsPerRow}
          onChange={handleColumnsPerRowChange}
        />
        <Divider />
        <CheckboxGroup
          widgetType={fieldData.widgetType}
          fieldData={fieldData}
          onEditableToggle={handleCheckboxChange(toggleEditMode)}
          onCollapsibleToggle={handleCheckboxChange(toggleCollapseMode)}
          onPaginationToggle={handleCheckboxChange(togglePagination)}
          onAvatarToggle={handleCheckboxChange(toggleAvatar)}
          onSearchToggle={handleCheckboxChange(toggleSearchOption)}
          onNavBarCenteredToggle={handleNavBarCenteredToggle}
        />
        <FieldSelects
          navBar={fieldData.navBar!}
          card={fieldData.card!}
          widgetType={fieldData.widgetType}
          pagination={fieldData.pagination}
          paginationPosition={fieldData.paginationPosition}
          paginationPositions={paginationPositions}
          fieldValues={fieldData.data.map((field) => ({
            value: field.sourceName,
            label: field.displayName,
            data: field.value,
          }))}
          onFieldUpdate={handleFieldUpdate}
          onPaginationPositionChange={(e) =>
            dispatch(updatePaginationPosition(e))
          }
          onNavBarSizeChange={handleNavBarSizeChange}
          onNavBarTypeChange={handleNavBarTypeChange}
          onCardTitleChange={handleCardTitleChange}
          onCardDescriptionChange={handleCardDescriptionChange}
          onCardImageChange={handleCardImageChange}
        />
      </Form>
    </Card>
  );
};

// Component for Widget Name Input
const WidgetNameInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <Form.Item label="Widget Name" className="form-item">
    <Input
      size="large"
      placeholder="Your widget name"
      value={value}
      onChange={onChange}
      prefix={<HighlightOutlined className="input-icon" />}
    />
  </Form.Item>
);

// Component for Theme Selector
const ThemeSelector = ({
  darkMode,
  onChange,
}: {
  darkMode: boolean;
  onChange: () => void;
}) => (
  <Form.Item label="Theme" className="form-item">
    <Select
      size="large"
      value={darkMode ? "dark" : "light"}
      onChange={onChange}
      style={{ width: "100%" }}
    >
      <Select.Option value="light">
        <SunOutlined className="input-icon" /> Light
      </Select.Option>
      <Select.Option value="dark">
        <MoonOutlined className="input-icon" /> Dark
      </Select.Option>
    </Select>
  </Form.Item>
);

// Component for Columns Per Row Input
const ColumnsInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number | null) => void;
}) => (
  <Form.Item label="Columns Per Row" className="form-item">
    <InputNumber
      min={1}
      max={12}
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      required
    />
  </Form.Item>
);

// Component for Checkbox Group
const CheckboxGroup = ({
  widgetType,
  fieldData,
  onEditableToggle,
  onCollapsibleToggle,
  onPaginationToggle,
  onAvatarToggle,
  onSearchToggle,
  onNavBarCenteredToggle,
  onNavBarSizeChange,
  onNavBarTypeChange,
}: {
  widgetType: WidgetType;
  fieldData: FieldData;
  onEditableToggle: () => void;
  onCollapsibleToggle: () => void;
  onPaginationToggle: () => void;
  onAvatarToggle: () => void;
  onSearchToggle: () => void;
}) => (
  <Form.Item className="checkbox-group">
    {widgetType === WidgetType.BasicWidget ? (
      <>
        <Checkbox checked={fieldData.editable} onChange={onEditableToggle}>
          Editable
        </Checkbox>
        <Checkbox
          checked={fieldData.collapsible}
          onChange={onCollapsibleToggle}
        >
          Collapsible
        </Checkbox>
      </>
    ) : null}
    {widgetType === WidgetType.Table ? (
      <Checkbox checked={fieldData.pagination} onChange={onPaginationToggle}>
        Pagination
      </Checkbox>
    ) : null}
    {widgetType === WidgetType.List || widgetType == WidgetType.LeftPanel ? (
      <Checkbox checked={fieldData.avatar} onChange={onAvatarToggle}>
        Avatar
      </Checkbox>
    ) : null}
    {widgetType === WidgetType.List ||
    widgetType == WidgetType.LeftPanel ||
    widgetType === WidgetType.Table ? (
      <Checkbox checked={fieldData.searchOption} onChange={onSearchToggle}>
        Search Bar
      </Checkbox>
    ) : null}
    {widgetType === WidgetType.NavBar ? (
      <Checkbox checked={fieldData.navBar?.centered}>Centered</Checkbox>
    ) : null}
  </Form.Item>
);

// Component for Field Selections and Pagination Position
const FieldSelects = ({
  navBar,
  card,
  widgetType,
  pagination,
  paginationPosition,
  paginationPositions,
  fieldValues,
  onFieldUpdate,
  onPaginationPositionChange,
  onNavBarSizeChange,
  onNavBarTypeChange,
  onCardTitleChange,
  onCardDescriptionChange,
  onCardImageChange,
}: {
  navBar: NavBar;
  card: CardProps;
  widgetType: WidgetType;
  pagination: boolean;
  paginationPosition: string;
  paginationPositions: { label: string; value: string }[];
  fieldValues: { value: string; label: string }[];
  onFieldUpdate: (
    selectedFields: string[],
    property: "setAsTitle" | "setAsDescription" | "setAsExtra"
  ) => void;
  onPaginationPositionChange: (value: string) => void;
  onNavBarSizeChange: (value: ComponentSizes) => void;
  onNavBarTypeChange: (value: ComponentTypes) => void;
  onCardTitleChange: (value: string[]) => void;
  onCardDescriptionChange: (value: string[]) => void;
  onCardImageChange: (value: string[]) => void;
}) => (
  <div className="styling__config__form">
    {widgetType === WidgetType.List ||
    widgetType === WidgetType.LeftPanel ||
    widgetType === WidgetType.Card ? (
      <>
        <FieldSelect
          label="Title"
          onChange={(e) => onFieldUpdate(e, "setAsTitle")}
          options={fieldValues}
        />
        <FieldSelect
          label="Description"
          onChange={(e) => onFieldUpdate(e, "setAsDescription")}
          options={fieldValues}
        />
        <FieldSelect
          label={widgetType === WidgetType.Card ? "Image" : "Content"}
          onChange={(e) => onFieldUpdate(e, "setAsExtra")}
          options={fieldValues}
        />
      </>
    ) : null}
    {widgetType === WidgetType.Table && pagination && (
      <Form.Item label="Pagination Position">
        <Select
          value={paginationPosition}
          onChange={onPaginationPositionChange}
          options={paginationPositions}
          style={{ width: "150px" }}
        />
      </Form.Item>
    )}
    {widgetType === WidgetType.NavBar ? (
      <div className="styling__config__form">
        <div className="form__field">
          <span>Size</span>
          <Select
            onChange={(e: ComponentSizes) => onNavBarSizeChange(e)}
            value={navBar.size}
            defaultValue={ComponentSizes.MEDIUM}
            options={SIZE}
          />
        </div>
        <div className="form__field">
          <span>Type</span>
          <Select
            onChange={(e: ComponentTypes) => onNavBarTypeChange(e)}
            value={navBar.type}
            defaultValue={ComponentTypes.LINE}
            options={NAVBAR_TYPES}
          />
        </div>
      </div>
    ) : null}
  </div>
);

const FieldSelect = ({
  label,
  onChange,
  options,
}: {
  label: string;
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="form__field">
    <span>{label}</span>
    <Select
      mode="multiple"
      allowClear
      style={{ width: "100%" }}
      placeholder="Please select"
      onChange={onChange}
      options={options}
    />
  </div>
);

export default Styling;
