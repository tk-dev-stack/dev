import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Table } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/Redux/store";
import { updateField } from "src/Redux/Dashboard/dashboard.reducer";
import "./Validation.scss";
import { getValidationRules, validationOptions } from "@features/Dashboard/UIConfig/components/Validation/validation/validationRules";

const EditableContext = React.createContext<any>(null);

interface DataType {
  key: string;
  fieldName: string;
  defaultValue: string;
  maxLength: number;
  minLength: number;
  validation: string;
  includeSpecialCharacters: boolean;
}

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
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
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
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
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

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={
          dataIndex === "defaultValue"
            ? getValidationRules(record.validation)
            : [{ required: true, message: `${title} is required.` }]
        }
      >
        {dataIndex === "maxLength" || dataIndex === "minLength" ? (
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
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

const Validation: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const dispatch = useDispatch();
  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData.data
  );

  useEffect(() => {
    const data = fieldData.map((field, index) => ({
      key: `${index}`,
      fieldName: field.displayName,
      defaultValue: field.defaultValue || "Null",
      maxLength: field.maxLength,
      minLength: field.minLength,
      validation: field.validation,
      includeSpecialCharacters: field.includeSpecialCharacters,
    }));
    setDataSource(data);
  }, [fieldData]);

  const handleSave = (row: DataType) => {
    const index = Number(row.key); // Ensure index is a number
    dispatch(
      updateField({
        index,
        field: {
          maxLength: Number(row.maxLength),
          minLength: Number(row.minLength),
          defaultValue: row.defaultValue,
          includeSpecialCharacters: row.includeSpecialCharacters,
        },
      })
    );
  };
  useEffect(() => {}, [fieldData]);
  // handle validation change
  const handleValidationChange = (key: string, value: string) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, validation: value });
      setDataSource(newData);

      // Dispatch the update to Redux
      dispatch(
        updateField({
          index,
          field: { validation: value },
        })
      );
    }
  };
  //handle include special characters
  const handleSpecialCharacterToggle = (key: string, checked: boolean) => {
    const newData = [...dataSource]; // Make a copy of your data
    const index = newData.findIndex((item) => item.key === key); // Find the record by key
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, includeSpecialCharacters: checked });
      setDataSource(newData); // Update the state
    }

    // If using Redux, dispatch the updated field
    dispatch(
      updateField({
        index,
        field: { includeSpecialCharacters: checked },
      })
    );
  };

  const columns = [
    {
      title: "Display Name",
      dataIndex: "fieldName",
      width: "13%",
      editable: false,
    },

    {
      title: "Min Length",
      dataIndex: "minLength",
      width: "7%",
      editable: true,
    },
    {
      title: "Max Length",
      dataIndex: "maxLength",
      width: "7%",
      editable: true,
    },
    {
      title: "Special Characters",
      dataIndex: "includeSpecialCharacters",
      width: "9%",
      render: (_: boolean, record: DataType) => (
        <Switch
          size="small"
          checked={record.includeSpecialCharacters}
          onChange={(checked) =>
            handleSpecialCharacterToggle(record.key, checked)
          }
        />
      ),
    },
    {
      title: "Validation Type",
      dataIndex: "validationType",
      width: "10%",
      render: (_: string, record: DataType) => (
        <Select
          defaultValue={record.validation || "alphanumeric"}
          onChange={(value) => handleValidationChange(record.key, value)}
          style={{ width: 80 }}
          options={validationOptions}
        />
      ),
    },
    {
      title: "Default Value",
      dataIndex: "defaultValue",
      width: "8%",
      editable: true,
    },
  ].map((col) => ({
    ...col,
    onCell: (record: DataType) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
    }),
  }));

  return (
    <div className="mapping__container">
      <div className="styling__header">Field Validation</div>
      <div className="validation__table">
        <Table<DataType>
          components={{
            body: {
              row: EditableRow,
              cell: EditableCell,
            },
          }}
          dataSource={dataSource}
          columns={columns}
          size="small"
          rowClassName="editable-row"
          pagination={false}
          scroll={{
            scrollToFirstRowOnChange: true,
            x: 20,
            y: "calc(70vh - 123px)",
          }}
        />
      </div>
    </div>
  );
};

export default Validation;
