import {
  Checkbox,
  Form,
  Popover,
  Select,
  Table,
  Button,
  InputNumber,
  Tooltip,
} from "antd";
import "../../UIconfig.scss";
import "./Formating.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import {
  updateField,
  updateFieldData,
} from "src/Redux/Dashboard/dashboard.reducer"; // Use updateField
import { dateFormatOptions } from "@constants/dateformat";
import {
  EditOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { DataTypes, dataTypesOptions } from "@constants/dataTypeOptions";
import { recalculateLayout } from "src/helpers/recalculateLayout";
import { WidgetType } from "@constants/widgets";
import { inputTypeOptions, InputTypes } from "@constants/inputTypeOptions";
import DropdownConfigurationComponent from "./DropdownConfigaration/DropdownConfiguration";

interface DataType {
  key: string;
  displayName: string;
  dataType: string;
  format: string;
  prefix: string;
  prefixAlignment: string;
  copyable: boolean;
  Precision?: number;
  hidden: boolean;
  span: number;
  inputType?: string;
}

const prefixOptions = [
  { label: "$", value: "$" },
  { label: "₹", value: "₹" },
];
const prefixAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

const Formating = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DataType[]>([]);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<DataType | null>(null);
  // State to control visibility of the dropdown configuration component
  const [showDropdownConfig, setShowDropdownConfig] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const dispatch = useDispatch();

  // Handler to show the dropdown configuration component
  const handleConfigureDropdown = (record: DataType, index: number) => {
    setSelectedField(record); // To know which field is being configured
    setShowDropdownConfig(true); // Hide the table and show the configuration component
    setSelectedIndex(index);
  };
  // Fetch fieldData from Redux
  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const columnCount = useSelector(
    (state: RootState) => state.dashboard.fieldData.columnsPerRow
  );
  useEffect(() => {
    if (fieldData && fieldData.data) {
      const formattedFields: DataType[] = fieldData.data.map(
        (field, index) => ({
          ...field,
          key: `${index}`,
          displayName: field.sourceName,
          dataType: field.dataType,
          format: field.dateFormat,
          prefix: field.prefix || "", // Include prefix
          copyable: field.copyable,
          prefixAlignment: field.prefixAlignment,
          Precision: field.Precision,
          hidden: field.hidden,
          inputType: field.inputType,
        })
      );

      setData(formattedFields);
    }
  }, [fieldData]);

  const handleFieldChange = (
    value: string | boolean | number | null,
    record: DataType,
    fieldKey: string
  ) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === record.key);

    if (index > -1) {
      newData[index] = { ...newData[index], [fieldKey]: value }; // Update field locally
      setData(newData);

      // Update Redux store by only updating the specific field
      dispatch(
        updateField({
          index,
          field: { [fieldKey]: value },
        })
      );
    }
  };

  const handleActionsClick = (record: DataType) => {
    setSelectedField(record);
    setPopoverVisible(true);
  };

  const handlePopoverClose = () => {
    setPopoverVisible(false);
    setSelectedField(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (selectedField) {
      const index = data.findIndex((item) => item.key === selectedField.key);
      if (index > -1) {
        // Update the local state for selectedField
        setSelectedField({ ...selectedField, hidden: checked });

        // Recalculate the layout with the updated data
        const updatedData = data.map((item, idx) =>
          idx === index
            ? { ...item, hidden: checked, span: checked ? item.span : 1 }
            : item
        );

        // Convert span to a number if it's a string
        const formattedData = updatedData.map((item) => ({
          ...item,
          span: typeof item.span === "string" ? Number(item.span) : item.span,
        }));
        // Execute recalculateLayout with validated data and current columnCount
        const recalculatedLayout = recalculateLayout(
          formattedData,
          columnCount
        );

        // Dispatch the updated layout to Redux
        dispatch(updateFieldData(recalculatedLayout));
      }
    }
  };
  const hasAmountType: boolean = data.some(
    (record) => record.dataType === DataTypes.Amount
  );
  const hasDateType: boolean = data.some(
    (record) => record.dataType === DataTypes.Date
  );
  const hasDecimal: boolean = data.some(
    (record) => record.dataType === DataTypes.Decimal
  );

  const columns = [
    {
      title: "Field",
      dataIndex: "displayName",
      width: "15%",
    },
    {
      title: "Data Type",
      dataIndex: "dataType",
      width: "15%",
      render: (_: any, record: DataType) => (
        <Select
          style={{ width: "100%" }}
          value={record.dataType}
          options={dataTypesOptions}
          onChange={(value) => handleFieldChange(value, record, "dataType")}
        />
      ),
    },
    ...(fieldData.widgetType === WidgetType.BasicWidget && hasAmountType
      ? [
          {
            title: "Prefix",
            dataIndex: "prefix",
            width: "10%",
            render: (_: any, record: DataType) =>
              record.dataType === DataTypes.Amount ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.prefix}
                  options={prefixOptions}
                  onChange={(value) =>
                    handleFieldChange(value, record, "prefix")
                  }
                />
              ) : (
                ""
              ),
          },
          {
            title: "Prefix Alignment",
            dataIndex: "prefix",
            width: "10%",
            render: (_: any, record: DataType) =>
              record.dataType === DataTypes.Amount ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.prefixAlignment}
                  options={prefixAlignOptions}
                  onChange={(value) =>
                    handleFieldChange(value, record, "prefixAlignment")
                  }
                />
              ) : (
                ""
              ),
          },
        ]
      : []),
    ...(fieldData.widgetType === WidgetType.BasicWidget && hasDateType
      ? [
          {
            title: "Format",
            dataIndex: "format",
            width: "15%",
            render: (_: any, record: DataType) =>
              record.dataType === DataTypes.Date ? (
                <Select
                  style={{ width: "100%" }}
                  value={record.format}
                  options={dateFormatOptions}
                  onChange={(value) =>
                    handleFieldChange(value, record, "format")
                  }
                />
              ) : (
                <span></span>
              ),
          },
        ]
      : []),
    ...(hasDecimal || hasAmountType
      ? [
          {
            title: "Precision",
            dataIndex: "Precision",
            width: "10%",
            render: (_: any, record: DataType) =>
              record.dataType === DataTypes.Amount ||
              record.dataType === DataTypes.Decimal ? (
                <InputNumber
                  type="number"
                  size="middle"
                  style={{ width: "90%" }}
                  defaultValue={record.Precision ?? 2}
                  onChange={(value) =>
                    handleFieldChange(value, record, "Precision")
                  }
                />
              ) : (
                <span></span>
              ),
          },
        ]
      : []),
    ...(fieldData.widgetType === WidgetType.Form
      ? [
          {
            title: "Input Type",
            dataIndex: "inputType",
            width: "15%",
            render: (_: any, record: DataType, index: number) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Select
                  style={{ width: "80%" }}
                  value={record.inputType}
                  options={inputTypeOptions}
                  onChange={(value) =>
                    handleFieldChange(value, record, "inputType")
                  }
                />

                {/* Inline gear icon for configuring Dropdown */}
                {record.inputType === InputTypes.Dropdown && (
                  <Tooltip title="Configure dropdown">
                    <SettingOutlined
                      style={{ marginLeft: 8, cursor: "pointer" }}
                      onClick={() => handleConfigureDropdown(record, index)}
                    />
                  </Tooltip>
                )}
              </div>
            ),
          },
        ]
      : []),
    ...(fieldData.widgetType === WidgetType.BasicWidget
      ? [
          {
            title: "Copyable",
            dataIndex: "copyable",
            width: "10%",
            align: "center" as "center",
            render: (_: any, record: DataType) => (
              <Checkbox
                checked={record.copyable}
                onChange={(e) =>
                  handleFieldChange(e.target.checked, record, "copyable")
                }
              />
            ),
          },
        ]
      : []),
    {
      title: "Actions",
      dataIndex: "actions",
      width: "15%",
      render: (_: any, record: DataType) => (
        <Popover
          content={
            <div>
              <Checkbox
                checked={selectedField?.hidden}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              >
                Hidden
              </Checkbox>
            </div>
          }
          trigger="click"
          placement="bottomLeft"
          visible={popoverVisible && selectedField?.key === record.key}
          onVisibleChange={(visible) => {
            if (!visible) handlePopoverClose();
          }}
        >
          <Button onClick={() => handleActionsClick(record)} type="link">
            <EditOutlined />
          </Button>
        </Popover>
      ),
    },
  ];
  return (
    <div className="mapping__container">
      <div className="styling__header ">
        <span>Field Format</span>
        {showDropdownConfig && (
          <Button
            icon={<RightOutlined />}
            size="small"
            onClick={() => setShowDropdownConfig(false)}
          />
        )}
      </div>
      {showDropdownConfig ? (
        <div className="dropdown__configuration_container">
          <DropdownConfigurationComponent selectedIndex={selectedIndex ?? 0} />
        </div>
      ) : (
        <div className="styling__table">
          {data.length > 0 ? (
            <Form form={form} component={false}>
              <Table<DataType>
                size="middle"
                bordered={false}
                dataSource={data}
                columns={columns}
                rowClassName="editable-row"
                pagination={false}
                scroll={{
                  scrollToFirstRowOnChange: true,
                  x: 20,
                  y: "calc(70vh - 123px)",
                }}
              />
            </Form>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Formating;
