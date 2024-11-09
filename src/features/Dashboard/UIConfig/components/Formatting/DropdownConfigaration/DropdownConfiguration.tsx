import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Table,
  Tabs,
} from "antd";
import { AppDispatch, RootState } from "src/Redux/store";
import { fetchDropDownOption } from "src/Redux/FormComponents/DropDown/dropdown.actions";
import { parseData } from "@utils/parseData";
import styles from "./DropdownConfigurator.module.css";
import ApiForm from "@features/Dashboard/DataConfig/ApiForm";
import { UpdateDropdownOptions, updateField } from "src/Redux/Dashboard/dashboard.reducer";
import { sampleApi } from "@constants/sampleApis";

const { TabPane } = Tabs;

interface OptionType {
  key: string;
  value: string;
}
type DropdownConfigurationProps = {
  selectedIndex: number;
};
const DropdownConfigurationComponent: React.FC<DropdownConfigurationProps> = ({
  selectedIndex,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [manualOption, setManualOption] = useState<OptionType>({
    key: "",
    value: "",
  });
  // Fetch options data and parse it
  const OptionsList = useSelector(
    (state: RootState) => state.dropDownReducer.data
  );
  const ParsedOptionList = parseData(OptionsList);

  // Handle checkbox change for selecting/deselecting options
  const handleCheckboxChange = (option: OptionType, checked: boolean) => {
    const updatedOptions = checked
      ? [...selectedOptions, option]
      : selectedOptions.filter((item) => item.value !== option.value);

    setSelectedOptions(updatedOptions);
    updateDropdownOptions(updatedOptions);
  };

  // Update  with selected options in the correct format
  const updateDropdownOptions = (options: OptionType[]) => {
    const formattedOptions = options.map((opt) => ({
      label: opt.key,
      value: opt.value,
    }));

    dispatch(
      UpdateDropdownOptions({
        fieldIndex: selectedIndex, // Replace with the actual field index
        newOptions: formattedOptions,
      })
    );
  };
  // Handle changes to manual option inputs
  const handleManualOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof OptionType
  ) => {
    setManualOption({ ...manualOption, [field]: e.target.value });
  };

  // Handle saving the manual option to the list
  const handleAddOption = () => {
    if (manualOption.key && manualOption.value) {
      const updatedOptions = [...selectedOptions, manualOption];
      setSelectedOptions(updatedOptions);
      updateDropdownOptions(updatedOptions);
      setManualOption({ key: "", value: "" }); // Reset input fields
    }
  };
  // Table columns configuration
  const columns = [
    {
      title: "Label",
      dataIndex: "key",
      key: "label",
      width: "20%",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "20%",
    },
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      width: "20%",
      render: (_: any, record: OptionType) => (
        <Checkbox
          checked={selectedOptions.some((item) => item.value === record.value)}
          onChange={(e) => handleCheckboxChange(record, e.target.checked)}
        />
      ),
    },
  ];

  // Fetch data function passed to ApiForm
  const fetchData = (url: string) => {
    dispatch(fetchDropDownOption(url));
  };
  const handleSelectChange = (value: string) => {
    dispatch(
      updateField({ index: selectedIndex, field: { selectionMode: value } })
    );
  };
  return (
    <div className={styles.container}>
      <Form layout="vertical" className={styles.dropdown__config_form}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Dropdown Type">
              <Select
                size="middle"
                // value={}
                style={{ width: "100%" }}
                onChange={handleSelectChange}
              >
                <Select.Option value="single">Single selection</Select.Option>
                <Select.Option value="multiple">
                  Multiple selection
                </Select.Option>
                <Select.Option value="" disabled={true}>
                  Cascade selection
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Dropdown Options from API" key="1">
          <div className={styles.apiFormContainer}>
            <ApiForm fetchData={fetchData} sampleApi={sampleApi} />
          </div>
          <Table
            size="small"
            bordered={false}
            dataSource={ParsedOptionList}
            columns={columns}
            rowKey={(record) => record.value}
            pagination={false}
            scroll={{
              scrollToFirstRowOnChange: true,
              x: 20,
              y: "calc(50vh - 123px)",
            }}
          />
        </TabPane>
        <TabPane tab="Add Options Manually" key="2">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Option Label">
                <Input
                  value={manualOption.key}
                  onChange={(e) => handleManualOptionChange(e, "key")}
                  placeholder="Enter option label"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Option Value">
                <Input
                  value={manualOption.value}
                  onChange={(e) => handleManualOptionChange(e, "value")}
                  placeholder="Enter option value"
                />
              </Form.Item>
            </Col>
            <Col span={8} className={styles.addButtonContainer}>
              <Button
                type="primary"
                onClick={handleAddOption}
                disabled={!manualOption.key || !manualOption.value}
              >
                Add Option
              </Button>
            </Col>
          </Row>
          <Table
            size="small"
            bordered={false}
            dataSource={selectedOptions}
            columns={columns}
            rowKey={(record) => record.value}
            pagination={false}
            scroll={{
              scrollToFirstRowOnChange: true,
              x: 20,
              y: "calc(50vh - 123px)",
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DropdownConfigurationComponent;
