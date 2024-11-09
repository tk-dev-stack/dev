import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Input,
  Tooltip,
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateFieldData } from "src/Redux/Dashboard/dashboard.reducer"; // Assuming this is the correct import
import { RootState } from "src/Redux/store";
import styles from "./BasicWidget.module.scss";
import theme from "../../CommonStyles/ThemeStyles.module.scss"
import { Field, FieldData } from "src/types/interfaces";
import { format } from "date-fns";
import { DataTypes } from "@constants/dataTypeOptions";
import { emailRegex, zipCodeRegex } from "@constants/regex";
// import { emailRegex, zipCodeRegex } from "@constants/regex";

const { Title } = Typography;
// const { defaultAlgorithm, darkAlgorithm } = theme;
type AntBasicWidgetProps = {
  fieldData: FieldData;
};

const renderDefaultValueInput = (
  type: string,
  value: string,
  Precision: number
) => {
  // console.log(type, value, typeof value);
  if (type === DataTypes.Date) {
    return (
      <Form.Item
        // initialValue={value}
        // name={[name, "value"]}
        rules={[{ required: false, message: "Missing default value" }]}
      >
        <DatePicker
          defaultValue={value}
          // value={value}
          // style={{ width: "200px" }}
          placeholder="Select date"
          size="middle"
          format={"MM/DD/YYYY"}
        />
      </Form.Item>
    );
  } else if (type === DataTypes.Integer) {
    return (
      <Form.Item
      // rules={[{ required: false, message: "" }]}
      >
        <InputNumber
          defaultValue={value}
          type="number"
          style={{ width: "150px" }}
          placeholder="integer number decimal amount"
          size="middle"
        />
      </Form.Item>
    );
  } else if (type === DataTypes.Phone) {
    return (
      <Form.Item>
        <InputNumber
          defaultValue={value}
          style={{ width: "150px" }}
          placeholder=""
          size="middle"
          type="number"
        />
      </Form.Item>
    );
  } else if (type === DataTypes.Decimal || type === DataTypes.Amount) {
    return (
      <Form.Item>
        <InputNumber
          defaultValue={value}
          style={{ width: "150px" }}
          placeholder=""
          precision={Precision ?? 2}
          size="middle"
          type="number"
        />
      </Form.Item>
    );
  } else if (type === DataTypes.Email) {
    return (
      <Form.Item
        // name={[name, "value"]}
        rules={[
          {
            required: false,
            warningOnly: false,
            message: "Enter a valid email",
            pattern: emailRegex,
          },
        ]}
      >
        <Input defaultValue={value} placeholder="" size="middle" />
      </Form.Item>
    );
  } else if (type === DataTypes.ZipCode) {
    return (
      <Form.Item
        rules={[
          {
            required: true,
            warningOnly: false,
            message: "Enter a valid zip code",
            pattern: zipCodeRegex,
          },
        ]}
      >
        <Input defaultValue={value} placeholder="" size="middle" />
      </Form.Item>
    );
  } else if (type === DataTypes.Boolean) {
    return (
      <Form.Item
      // rules={[{ required: false, message: "Missing default value" }]}
      >
        <Select
          defaultValue={value}
          placeholder="Select true or false"
          size="middle"
        >
          <Select.Option value={true}>True</Select.Option>
          <Select.Option value={false}>False</Select.Option>
        </Select>
      </Form.Item>
    );
  } else {
    return (
      <Form.Item
      // initialValue={value}
      // name={[name, "value"]}
      // rules={[{ required: false, message: "Missing default value" }]}
      >
        <Input defaultValue={value} placeholder="" size="middle" />
      </Form.Item>
    );
  }
};

// Helper function to map data types to Ant Design components
const getInputComponent = (
  dataType: string,
  value: string | number | Date | boolean,
  dateFormat: string,
  copyable: boolean,
  maxLength: number,
  prefix: string,
  defaultValue: string,
  prefixAlignment: string
) => {
  if (dataType === DataTypes.Date) {
    return (
      <Typography.Text style={{ fontSize: "16px" }} copyable={copyable}>
        {format(value as Date, dateFormat || "MM/dd/yyyy")}
      </Typography.Text>
    );
  } else if (dataType === DataTypes.Boolean) {
    return (
      <Typography.Text style={{ fontSize: "16px" }} copyable={copyable}>
        {value ? "true" : "false"}
      </Typography.Text>
    );
  } else {
    return (
      <Typography.Text
        ellipsis={Boolean(value && value.toString().length > maxLength)}
        style={{ fontSize: "16px" }}
        copyable={copyable}
      >
        {prefixAlignment === "left" ? (
          <>
            {prefix}
            {value ? value.toString().slice(0, maxLength) : defaultValue}
          </>
        ) : (
          <>
            {value ? value.toString().slice(0, maxLength) : defaultValue}
            {prefix}
          </>
        )}
      </Typography.Text>
    );
  }
};

const BasicWidgetPreview: React.FC<AntBasicWidgetProps> = ({ fieldData }) => {
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.dashboard.actions);
  const [isEditing, setIsEditing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();

  const { editable, collapsible, darkMode } = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );

  // Configurable column count (e.g., 3 columns) and column width (24/column count)
  const columnCount = useSelector(
    (state: RootState) => state.dashboard.fieldData.columnsPerRow
  );

  const maxRow = Math.max(...fieldData.data.map((field) => field.row));
  const maxCol = Math.max(...fieldData.data.map((field) => field.column));
  // Initialize a 2D grid to store fields based on their row and column positions
  const grid: (Field | null)[][] = Array.from({ length: maxRow }, () =>
    Array(maxCol).fill(null)
  );

  // Populate the grid based on the fieldData
  fieldData.data.forEach((field) => {
    if (field.row && field.column) {
      const rowIndex = field.row - 1;
      const colIndex = field.column - 1;
      grid[rowIndex][colIndex] = field; // Place the field in the correct position
    }
  });
  const handleSave = () => {
    form.validateFields().then((_) => {
      const updatedValues = form.getFieldsValue();
      // Map the updated values back to the original grid structure
      const updatedFields = grid
        .flat()
        .filter((field) => field !== null)
        .map((field) => ({
          ...field,
          value: updatedValues[field.displayName], // Assign updated form values based on label
        }));

      dispatch(updateFieldData(updatedFields as Field[]));
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const themeClass = darkMode ? theme.darkTheme : theme.lightTheme;

  return (
    <div className={`${styles.antBasicWidgetContainer}  ${themeClass}`}>
      <div className={styles.widgetHeader}>
        <Title level={3}>{fieldData.widgetTitle}</Title>
        <Space>
          {collapsible && (
            <Button
              icon={collapsed ? <DownOutlined /> : <UpOutlined />}
              onClick={toggleCollapse}
              size="small"
            />
          )}
          {editable && !isEditing && (
            <Tooltip title="Edit">
              <Button
                onClick={() => setIsEditing(true)}
                size="middle"
                color={actions.edit.color as "default" | "primary" | "danger"}
                variant={
                  actions.edit.type as
                    | "link"
                    | "text"
                    | "outlined"
                    | "dashed"
                    | "solid"
                    | "filled"
                }
              >
                {actions.edit.text}
              </Button>
            </Tooltip>
          )}
          {editable && isEditing && (
            <>
              <Tooltip title="Save">
                <Button
                  onClick={handleSave}
                  size="middle"
                  color={actions.save.color as "default" | "primary" | "danger"}
                  variant={
                    actions.save.type as
                      | "link"
                      | "text"
                      | "outlined"
                      | "dashed"
                      | "solid"
                      | "filled"
                  }
                >
                  {actions.save.text}
                </Button>
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  // icon={<CloseOutlined />}
                  onClick={handleCancel}
                  type="default"
                  size="middle"
                >
                  Cancel
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      </div>

      <Form form={form} layout="vertical">
        {(collapsed ? [grid[0]] : grid).map((row, rowIndex) => (
          <Row gutter={16} key={`row-${rowIndex}`}>
            {row
              // .filter((field) => !field?.hidden)
              .map((field, colIndex) => {
                const span = field ? field.span * (24 / columnCount) : 0; // Calculate the span for each field
                return (
                  <Col key={`col-${colIndex}`} span={span}>
                    {field ? (
                      <Form.Item
                        name={field.sourceName}
                        label={field.displayName}
                        initialValue={field.value}
                      >
                        {isEditing
                          ? renderDefaultValueInput(
                              field.dataType,
                              field.value instanceof Date
                                ? field.value.toISOString()
                                : String(field.value),
                              field.Precision ?? 2
                            )
                          : getInputComponent(
                              field.dataType,
                              field.value!,
                              field.dateFormat,
                              field.copyable,
                              field.maxLength,
                              field.prefix,
                              field.defaultValue,
                              field.prefixAlignment
                            )}
                      </Form.Item>
                    ) : null}
                  </Col>
                );
              })}
          </Row>
        ))}
      </Form>
    </div>
  );
};

export default BasicWidgetPreview;
