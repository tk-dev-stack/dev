import { Form, GetRef, Input, InputRef, Select, Table, TableProps } from "antd";
import "../../UIconfig.scss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import { useDispatch } from "react-redux";
import {
  updateAction,
  updateFormAction,
} from "src/Redux/Dashboard/dashboard.reducer";
import { WidgetType } from "@constants/widgets";

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface DataType {
  key: React.Key;
  action: string;
  text: string;
  color: string;
  type: string;
  url: string;
  //   address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
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
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
  widgetType: string;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  widgetType,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
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
      const newObj: DataType = { ...record, ...values };

      if (widgetType === WidgetType.Form) {
        dispatch(
          updateFormAction({
            actionName: "submit",
            newAction: {
              text: newObj.text,
              color: newObj.color,
              type: newObj.type,
            },
          })
        );
      } else {
        dispatch(
          updateAction({
            actionName: newObj.action as "edit" | "save" | "cancel",
            newAction: {
              text: newObj.text,
              color: newObj.color,
              type: newObj.type,
            },
          })
        );
      }

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
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        {
          <Input
            placeholder=""
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
          />
        }
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

type ColumnTypes = Exclude<TableProps<DataType>["columns"], undefined>;

const Actions = () => {
  const dispatch = useDispatch();
  const actions = useSelector((state: RootState) => state.dashboard.actions);
  const formActions = useSelector(
    (state: RootState) => state.dashboard.formAction
  );
  const widgetType = useSelector(
    (state: RootState) => state.dashboard.fieldData.widgetType
  );
  const [dataSource, setDataSource] = useState<DataType[]>(
    widgetType === WidgetType.Form
      ? [
          {
            key: "0",
            action: "submit",
            text: formActions.submit.text,
            url: formActions.submit.url,
            color: formActions.submit.color,
            type: formActions.submit.type,
          },
        ]
      : [
          {
            key: "0",
            action: "edit",
            text: actions.edit.text,
            url: actions.edit.url,
            color: actions.edit.color,
            type: actions.edit.type,
          },
          {
            key: "1",
            action: "cancel",
            text: actions.cancel.text,
            url: actions.cancel.url,
            color: actions.cancel.color,
            type: actions.cancel.type,
          },
          {
            key: "2",
            action: "save",
            text: actions.save.text,
            url: actions.save.url,
            color: actions.save.color,
            type: actions.save.type,
          },
        ]
  );

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "action",
      dataIndex: "action",
      editable: true,
    },
    {
      title: "Text",
      dataIndex: "text",
      editable: true,
    },
    {
      title: "URL",
      dataIndex: "url",
      editable: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (_, record) => (
        <Select
          onChange={(value) => {
            const newObj = { ...record, type: value };
            if (widgetType === WidgetType.Form) {
              dispatch(
                updateFormAction({
                  actionName: "submit",
                  newAction: { type: value },
                })
              );
            } else {
              dispatch(
                updateAction({
                  actionName: newObj.action as "edit" | "save" | "cancel",
                  newAction: { type: value },
                })
              );
            }
          }}
          style={{ width: 90 }}
          defaultValue={record.type}
          options={[
            { value: "link", label: "Link" },
            { value: "text", label: "Text" },
            { value: "outlined", label: "Outlined" },
            { value: "dashed", label: "Dashed" },
            { value: "solid", label: "Solid" },
            { value: "filled", label: "Filled" },
          ]}
        />
      ),
    },

    // {
    //   title: "Color",
    //   dataIndex: "color",
    //   render: (_, record) => (
    //     <Select
    //       onChange={(value) => {
    //         const newObj = {
    //           ...record,
    //           color: value,
    //         };
    //         dispatch(
    //           updateAction({
    //             actionName: newObj.action as "edit" | "save" | "cancel",
    //             newAction: {
    //               color: value,
    //             },
    //           })
    //         );
    //       }}
    //       style={{ width: 80 }}
    //       defaultValue={"default"}
    //       options={[
    //         { value: "default", label: "Default" },
    //         { value: "primary", label: "Primary" },
    //         { value: "danger", label: "Danger" },
    //       ]}
    //     />
    //   ),
    //   // editable: true,
    // },
    // {
    //   title: <EditOutlined />,
    //   width: "15%",
    //   dataIndex: "operation",
    //   render: (_, record) =>
    //     dataSource.length >= 1 ? (
    //       <Popconfirm
    //         title="Sure to delete?"
    //         onConfirm={() => handleDelete(record.key)}
    //       >
    //         <a>
    //           <MinusCircleOutlined />
    //         </a>
    //       </Popconfirm>
    //     ) : null,
    // },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        widgetType: widgetType,
      }),
    };
  });

  return (
    <div className="actions__container">
      <div className="styling__header">Actions</div>
      <div className="actions__content">
        <Table<DataType>
          components={components}
          pagination={false}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </div>
    </div>
  );
};

export default Actions;
