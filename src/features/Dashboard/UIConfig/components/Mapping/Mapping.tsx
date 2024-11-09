import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Modal,
  Select,
  Checkbox,
} from "antd";
import "../../UIconfig.scss";
import "./Mapping.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import {
  updateField,
  updateFieldData,
} from "src/Redux/Dashboard/dashboard.reducer";
import { Field } from "src/types/interfaces";
import { recalculateLayout } from "src/helpers/recalculateLayout";

const { Option } = Select;

// Editable Context for Table
const EditableContext = React.createContext<any>(null);

const EditableRow: React.FC<any> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: any;
  handleSave: (record: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing && !record.hidden) {
      // Only focus if not hidden
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    if (!record.hidden) {
      // Prevent toggling edit if hidden
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable && !record.hidden) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        {dataIndex === "row" || dataIndex === "column" ? (
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
        ) : dataIndex === "span" ? (
          <InputNumber
            ref={inputRef}
            min={1}
            max={24}
            onPressEnter={save}
            onBlur={save}
          />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const Mapping = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const columnCount = useSelector(
    (state: RootState) => state.dashboard.fieldData.columnsPerRow
  );
  // Local state for table data
  const [dataSource, setDataSource] = useState<any[]>(fieldData.data || []);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleSave = (row: any) => {
    const index = dataSource.findIndex(
      (item) => row.sourceName === item.sourceName
    );

    if (index > -1) {
      // Update the specific field in the local data
      const newData = [...dataSource];
      newData[index] = { ...newData[index], ...row };

      // Only recalculate layout if the span has changed
      const hasSpanChanged = newData[index].span !== dataSource[index].span;

      if (hasSpanChanged) {
        // Recalculate layout based on the updated data
        const recalculatedData = recalculateLayout(newData, columnCount);
        // Update the state and Redux store
        setDataSource(recalculatedData);
        dispatch(updateFieldData(recalculatedData as Field[]));
      } else {
        // If span hasn't changed, just update the local state
        setDataSource(newData);
        dispatch(updateField({ index, field: { ...row } }));
      }
    }
  };

  // Set initial data for dataSource
  useEffect(() => {
    const data = fieldData.data.map((field) => ({
      ...field,
      sourceName: field.sourceName,
      displayName: field.displayName ? field.displayName : field.sourceName,
    }));
    setDataSource(data);
  }, [fieldData]);

  const handleCombineFields = (values: {
    sourceName: string;
    hideParents: boolean;
  }) => {
    if (selectedFields.length < 2) return;

    const selectedFieldData = selectedFields.map((sourceName) =>
      fieldData.data.find((field) => field.sourceName === sourceName)
    );
    const validFields = selectedFieldData.filter(Boolean);

    if (validFields.length >= 2) {
      let nextRow = 1;
      let nextColumn = 1;
      const rowCounts: { [key: number]: number } = {};

      fieldData.data.forEach((field) => {
        if (field.hidden) {
          const currentRow = Number(field.row);
          const currentColumn = Number(field.column);

          if (!rowCounts[currentRow]) {
            rowCounts[currentRow] = 0;
          }

          rowCounts[currentRow]++;
          if (rowCounts[currentRow] === columnCount) {
            nextRow = currentRow + 1;
            nextColumn = 1;
          } else {
            nextColumn = currentColumn + 1;
          }
        }
      });

      const combinedDefaultValue = validFields
        .map((field) => field?.value)
        .join(" ");

      const newField = {
        sourceName: values.sourceName,
        displayName: values.sourceName,
        defaultValue: "",
        value: combinedDefaultValue,
        row: nextRow,
        column: nextColumn,
        maxLength: validFields[0]?.maxLength ?? 20,
        minLength: 0,
        dateFormat: "MM/dd/yyyy",
        copyable: false,
        span: 1,
        hidden: false,
        Precision: 2,
        prefixAlignment: "left",
        prefix: "",
        validation: "alphanumeric",
        includeSpecialCharacters: false,
        dataType: "",
        inputType: "",
        setAsTitle: false,
        setAsDescription: false,
        setAsExtra: false,
        options: [{ label: "Option 1", value: "option1" }], // Only for dropdown type fields
        selectionMode: "", // Only for dropdown type fields
      };

      // Only hide selected fields if the checkbox "hideParents" is checked
      const updatedFieldData = fieldData.data.map((field) =>
        selectedFields.includes(field.sourceName)
          ? values.hideParents
            ? { ...field, hidden: true, row: 0, column: 0, span: 0 }
            : field
          : field
      );

      updatedFieldData.push(newField);
      const recalculatedData = recalculateLayout(updatedFieldData, columnCount);

      setDataSource(recalculatedData);
      dispatch(updateFieldData(recalculatedData as Field[]));
      handleModalClose();
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close modal
    form.resetFields(); // Reset form fields
    setSelectedFields([]); // Clear selected fields
  };

  // Filter out the selected fields from the dropdown options
  const filteredFieldOptions = fieldData.data.filter((field) => {
    return !selectedFields.includes(field.sourceName);
  });

  // Columns definition
  const columns = [
    {
      title: "Display Name",
      dataIndex: "displayName",
      key: "sourceName",
      editable: true,
    },
    {
      title: "Source Name",
      dataIndex: "sourceName",
      key: "sourceName",
      editable: false,
    },
    {
      title: "Column Span",
      dataIndex: "span",
      key: "span",
      // editable: true,
      render: (_: any, record: any) => (
        <Select
          defaultValue={record.span}
          onChange={(value) => {
            // Update the selected span value in Redux
            handleSave({ ...record, span: value });
          }}
          style={{ width: "80px" }}
        >
          {/* Generate dropdown options dynamically based on columnCount */}
          {[...Array(columnCount)].map((_, index) => (
            <Option key={index + 1} value={index + 1}>
              {index + 1}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Row",
      dataIndex: "row",
      key: "row",
      editable: true,
      width: "80px",
    },
    {
      title: "Column",
      dataIndex: "column",
      key: "column",
      editable: true,
    },
  ].map((col) => ({
    ...col,
    onCell: (record: any) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  return (
    <div className="mapping__container">
      <div className="styling__header">
        <span>Field Mapping</span>
        <Button
          type="primary"
          style={{ marginLeft: 16 }}
          onClick={() => setIsModalVisible(true)} // Open modal
        >
          Combine Fields
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        scroll={{
          scrollToFirstRowOnChange: true,
          x: 0,
          y: "calc(70vh - 100px)",
        }}
        columns={columns}
        rowKey="sourceName"
        pagination={false}
        size="middle"
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        rowClassName={(record) => (record.hidden ? "disabled-row" : "")} // Apply "disabled-row" class conditionally
      />

      {/* Modal for combining fields */}
      <Modal
        title="Combine Fields"
        visible={isModalVisible}
        onCancel={handleModalClose} // Close modal and reset form
        footer={null} // Hide default footer
      >
        <Form form={form} onFinish={handleCombineFields} layout="vertical">
          <Form.Item
            label="Field Label"
            name="sourceName"
            rules={[
              { required: true, message: "Please input the field name!" },
            ]}
          >
            <Input size="large" placeholder="Enter field label" />
          </Form.Item>

          <Form.Item label="Select Fields" name="fields">
            <Select
              mode="multiple"
              onChange={setSelectedFields}
              size="large"
              placeholder="Select at least two fields"
              showArrow
              maxTagCount="responsive"
              allowClear
            >
              {filteredFieldOptions.map((field) => (
                <Option key={field.sourceName} value={field.sourceName}>
                  {field.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="hideParents" valuePropName="checked">
            <Checkbox>Hide selected parent fields</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={selectedFields.length < 2} // Disable if less than 2 fields selected
            >
              Combine Fields
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Mapping;
