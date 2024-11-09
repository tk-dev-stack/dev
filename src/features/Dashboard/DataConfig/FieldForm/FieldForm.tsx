import React, { useEffect } from "react";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  DatePicker,
  InputNumber,
} from "antd"; // Import DatePicker
import { useDispatch } from "react-redux";
import { updateFieldData } from "src/Redux/Dashboard/dashboard.reducer"; // Import action
import { Field } from "src/types/interfaces"; // Import types
import "./FieldForm.scss";
import { useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import { DataTypes } from "@constants/dataTypeOptions";
import { emailRegex, zipCodeRegex } from "@constants/regex";

interface ParsedData {
  key: string;
  value: string;
  type: string;
}

interface FieldFormProps {
  parsedData: ParsedData[];
}

const FieldForm: React.FC<FieldFormProps> = ({ parsedData }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const columnsPerRow = useSelector(
    (state: RootState) => state.dashboard.fieldData.columnsPerRow
  );

  // Function to calculate and dispatch updated fields based on columnsPerRow
  let isFormInitializedWithparsedData = false;
  const calculateFields = (manualFields: any[] = []) => {
    let rowCount = 1;
    let columnCount = 0;

    const combinedFields: Field[] = [
      ...manualFields.map((data) => {
        if (columnCount < columnsPerRow) {
          columnCount++;
        } else {
          columnCount = 1;
          rowCount++;
        }
        return {
          sourceName: data.sourceName,
          displayName: data.sourceName,
          dataType: data.dataType,
          value: data.value || "",
          defaultValue: "",
          row: rowCount,
          column: columnCount,
          span: 1,
          maxLength: 20,
          minLength: 2,
          dateFormat: "MM/dd/yyyy",
          copyable: false,
          hidden: false,
          includeSpecialCharacters: false,
          validation: "alphanumeric",
          prefix: "",
          prefixAlignment: "left",
          Precision: 2,
          selectionMode: "",
          inputType: "",
          setAsTitle: false,
          setAsDescription: false,
          setAsExtra: false,
        };
      }),
    ];

    console.log("calculate fields", combinedFields);
    dispatch(updateFieldData(combinedFields));
  };

  // On form submission
  const onFinish = (values: { configForm: any[] }) => {
    const manualFields = values.configForm || [];
    calculateFields(manualFields);
  };

  // Recalculate fields whenever columnsPerRow changes
  useEffect(() => {
    if (fieldData && fieldData.data) {
      calculateFields(fieldData.data);
    }
  }, [columnsPerRow]);

  useEffect(() => {
    if (
      parsedData &&
      parsedData.length > 0 &&
      !isFormInitializedWithparsedData
    ) {
      // Prevent re-initialization with the same parsedData to avoid duplicates
      isFormInitializedWithparsedData = true;
      const initialFields = parsedData.map((data) => ({
        sourceName: data.key,
        dataType: data.type,
        value: data.value,
      }));
      form.setFieldsValue({ configForm: initialFields });
    } else {
      form.setFieldsValue({ configForm: [{}] });
    }
  }, [form, parsedData]);

  useEffect(() => {
    if (fieldData && fieldData.data.length > 0) {
      const initialFields = fieldData.data.map((field) => ({
        sourceName: field.sourceName,
        dataType: field.dataType,
        value: field.value,
      }));
      form.setFieldsValue({ configForm: initialFields });
    } else {
      form.setFieldsValue({ configForm: [{}] });
    }
  }, [fieldData, form]);

  const renderDefaultValueInput = (type: string, name: number) => {
    if (type === DataTypes.Date) {
      return (
        <Form.Item
          name={[name, "value"]}
          rules={[{ required: false, message: "Missing default value" }]}
        >
          <DatePicker
            style={{ width: "200px" }}
            placeholder="Select date"
            size="middle"
            format={"MM/DD/YYYY"}
          />
        </Form.Item>
      );
    } else if (
      type === DataTypes.Decimal ||
      type === DataTypes.Integer ||
      type === DataTypes.Amount
    ) {
      return (
        <Form.Item
          name={[name, "value"]}
          rules={[{ required: false, message: "Missing default value" }]}
        >
          <InputNumber
            style={{ width: "180px" }}
            type="number"
            placeholder="Default value"
            size="middle"
          />
        </Form.Item>
      );
    } else if (type === DataTypes.Phone) {
      return (
        <Form.Item name={[name, "value"]}>
          <InputNumber
            style={{ width: "200px" }}
            placeholder="Default value"
            size="middle"
          />
        </Form.Item>
      );
    } else if (type === DataTypes.Email) {
      return (
        <Form.Item
          name={[name, "value"]}
          rules={[
            {
              required: false,
              warningOnly: false,
              message: "Enter a valid email",
              pattern: emailRegex,
            },
          ]}
        >
          <Input placeholder="Default value" size="middle" />
        </Form.Item>
      );
    } else if (type === DataTypes.ZipCode) {
      return (
        <Form.Item
          name={[name, "value"]}
          rules={[
            {
              required: false,
              warningOnly: false,
              message: "Enter a valid zip code",
              pattern: zipCodeRegex,
            },
          ]}
        >
          <Input placeholder="Default value" size="middle" />
        </Form.Item>
      );
    } else if (type === DataTypes.Boolean) {
      return (
        <Form.Item
          name={[name, "value"]}
          initialValue={true}
          rules={[{ required: false, message: "Missing default value" }]}
        >
          <Select
            placeholder="Select true or false"
            size="middle"
            style={{ width: "200px" }}
          >
            <Select.Option value={true}>True</Select.Option>
            <Select.Option value={false}>False</Select.Option>
          </Select>
        </Form.Item>
      );
    } else {
      return (
        <Form.Item
          name={[name, "value"]}
          rules={[{ required: false, message: "Missing default value" }]}
        >
          <Input placeholder="Default value" size="middle" />
        </Form.Item>
      );
    }
  };

  return (
    <div className="field-form--wrapper">
      <Row className="form__header">
        <Col span={12} className="form__header_title">
          Field
        </Col>
        {/* <Col span={8} className="form__header_title">
          Type
        </Col> */}
        <Col span={12} className="form__header_title">
          {parsedData && parsedData.length > 0 ? "Value" : "Default"}
        </Col>
      </Row>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="form__fields">
          <Form.List name="configForm">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline">
                    <Row gutter={12}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "sourceName"]}
                          rules={[
                            { required: true, message: "Missing field name" },
                          ]}
                        >
                          <Input placeholder="Field Name" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {renderDefaultValueInput(
                          form.getFieldValue(["configForm", name, "dataType"]),
                          name
                        )}
                      </Col>
                    </Row>
                    <CloseCircleOutlined onClick={() => remove(name)} />
                    {/* {key} */}
                    {/* {form.getFieldValue("configForm").length} */}
                    {/* {restField.fieldKey ===
                      form.getFieldValue("configForm").length - 1 && (
                      <PlusCircleOutlined
                        onClick={() => {
                          // setFieldCount(fieldCount + 1);
                          add();
                        }}
                      />
                    )} */}
                  </Space>
                ))}
                <div className="field__add-btn">
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    // block
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </div>
              </>
            )}
          </Form.List>

          <Form.Item className="fieldform__submit--btn">
            <Button type="primary" htmlType="submit">
              Preview
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default FieldForm;
