import React from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Typography,
  InputNumber,
  DatePicker,
  Select,
  Checkbox,
} from "antd";
import styles from "./antFormWidget.module.css";
import theme from "../../CommonStyles/ThemeStyles.module.scss";
import { Field } from "src/types/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import { emailRegex, zipCodeRegex } from "@constants/regex";
import { InputTypes } from "@constants/inputTypeOptions";

const { Title } = Typography;
type AntFormWidgetProps = {
  onSubmit?: (values: any) => void;
};

const FormWidgetPreview: React.FC<AntFormWidgetProps> = ({}) => {
  const [form] = Form.useForm();
  const formAction = useSelector(
    (state: RootState) => state.dashboard.formAction
  );
  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const { darkMode } = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );

  const maxRow = Math.max(...fieldData.data.map((field) => field.row));
  const maxCol = Math.max(...fieldData.data.map((field) => field.column));
  // Initialize a 2D grid to store fields based on their row and column positions
  const grid: (Field | null)[][] = Array.from({ length: maxRow }, () =>
    Array(maxCol).fill(null)
  );

  fieldData.data.forEach((field: any) => {
    if (field.row && field.column) {
      const rowIndex = parseInt(field.row, 10) - 1;
      const colIndex = parseInt(field.column, 10) - 1;
      grid[rowIndex][colIndex] = field;
    }
  });

  // Helper function to render inputs based on dataType
  const renderDefaultValueInput = (field: Field) => {
    const {
      displayName,
      defaultValue,
      Precision,
      maxLength,
      inputType,
      selectionMode,
    } = field;

    switch (inputType) {
      case InputTypes.Date:
        return (
          <Form.Item
            name={displayName}
            //  rules={[{  message: "Select a date" }]}
          >
            <DatePicker
              defaultValue={defaultValue}
              format="MM/DD/YYYY"
              placeholder="Select date"
            />
          </Form.Item>
        );

      case InputTypes.Number:
        // case InputTypes.Amount:
        return (
          <Form.Item
            name={displayName}
            rules={[
              //  { required: field.isRequired, message: "Enter a valid amount" },
              { type: "number", message: "Must be a decimal" },
            ]}
          >
            <InputNumber
              defaultValue={defaultValue}
              precision={Precision ?? 2}
              placeholder="Enter number"
              type="number"
              maxLength={maxLength}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );
      case InputTypes.Email:
        return (
          <Form.Item
            name={displayName}
            rules={[
              //  { required: field.isRequired, message: "Enter a valid email" },
              { pattern: emailRegex, message: "Invalid email format" },
            ]}
          >
            <Input
              defaultValue={defaultValue}
              placeholder="Enter email"
              maxLength={maxLength}
            />
          </Form.Item>
        );
      case InputTypes.ZipCode:
        return (
          <Form.Item
            name={displayName}
            rules={[
              //  { required: field.isRequired, message: "Enter a valid zip code" },
              { pattern: zipCodeRegex, message: "Invalid zip code format" },
            ]}
          >
            <Input
              defaultValue={defaultValue}
              placeholder="Enter zip code"
              maxLength={maxLength}
            />
          </Form.Item>
        );
      case InputTypes.Checkbox:
        return (
          <Form.Item name={displayName} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        );
      case InputTypes.Textarea:
        return (
          <Form.Item name={displayName}>
            <Input.TextArea
              defaultValue={defaultValue}
              placeholder={displayName}
              maxLength={maxLength}
            />
          </Form.Item>
        );
      case InputTypes.Password:
        return (
          <Form.Item name={displayName}>
            <Input.Password
              defaultValue={defaultValue}
              placeholder="Enter password"
              maxLength={maxLength}
            />
          </Form.Item>
        );
      case InputTypes.Text:
        return (
          <Form.Item
            name={displayName}
            rules={[
              {
                // required: field.isRequired,
                message: `${displayName} is required`,
              },
            ]}
          >
            <Input
              defaultValue={defaultValue}
              maxLength={maxLength}
              placeholder={displayName}
            />
          </Form.Item>
        );
      case InputTypes.Dropdown:
        return (
          <Form.Item name={displayName}>
            <Select
              defaultValue={defaultValue}
              mode={selectionMode as "multiple" | "tags" | undefined}
              allowClear
              placeholder="Select an option"
            >
              {field.options && field.options.length > 0 ? (
                field.options.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="default">
                  No options available
                </Select.Option>
              )}
            </Select>
          </Form.Item>
        );
      default:
        return (
          <Form.Item
            name={displayName}
            rules={[
              {
                //  required: field.isRequired,
                message: `${displayName} is required`,
              },
            ]}
          >
            <Input
              defaultValue={defaultValue}
              maxLength={maxLength}
              placeholder={displayName}
            />
          </Form.Item>
        );
    }
  };

  // Submit form handler
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // onSubmit(values);
        console.log("Form values::", values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const buttonPosition = "center";

  // Map button position to CSS flex properties
  const buttonPositionMap: { [key: string]: "start" | "center" | "end" } = {
    "bottom-left": "start",
    "bottom-center": "center",
    "bottom-right": "end",
  };
  const themeClass = darkMode ? theme.darkTheme : theme.lightTheme;
  return (
    <div className={`${styles.antFormWidgetContainer}  ${themeClass}`}>
      <Title level={3}>{fieldData.widgetTitle}</Title>
      <Form form={form} layout="vertical" className={styles.form}>
        {grid.map((row, rowIndex) => (
          <Row gutter={16} key={`row-${rowIndex + 1}`}>
            {row.map((field, colIndex) =>
              field ? (
                <Col key={`col-${colIndex + 1}`} span={24 / maxCol}>
                  <Form.Item
                    labelAlign="left"
                    // name={field.displayName}
                    label={field.displayName}
                    initialValue={field.defaultValue}
                    rules={[
                      {
                        // required: field.isRequired,
                        required: false,
                        message: `${field.displayName} is required`,
                      },
                    ]}
                  >
                    {renderDefaultValueInput(field)}
                  </Form.Item>
                </Col>
              ) : (
                <Col key={`col-${colIndex + 1}`} span={24 / maxCol} />
              )
            )}
          </Row>
        ))}

        <Row justify={buttonPositionMap[buttonPosition] || "end"}>
          <Col>
            <Button
              onClick={handleSubmit}
              color={
                formAction.submit.color as "default" | "primary" | "danger"
              }
              variant={
                formAction.submit.type as
                  | "link"
                  | "text"
                  | "outlined"
                  | "dashed"
                  | "solid"
                  | "filled"
              }
            >
              {formAction.submit.text}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormWidgetPreview;
