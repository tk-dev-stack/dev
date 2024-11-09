import React from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Tooltip,
  ConfigProvider,
  theme,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
// import styles from "./Preview.module.css"; // Optional: For custom styles if needed

const { Text } = Typography;

interface BasiWidgetProps {
  data?: { key: string; value: string; type: string | number }[];
  isDarkMode?: boolean;
}
const { defaultAlgorithm, darkAlgorithm } = theme;
const BasicWidget: React.FC<BasiWidgetProps> = ({ data, isDarkMode }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Card
        bordered={true}
        style={{ padding: "16px" }}
        //   className={styles.previewContainer}
      >
        <Text strong style={{ fontSize: "18px" }}>
          Widget Preview
        </Text>
        {data?.length === 0 ? (
          <Text>No data available to preview.</Text>
        ) : (
          <div style={{ marginTop: "16px" }}>
            <Row gutter={[16, 16]}>
              {data?.map((item, index) => (
                <Col span={8} key={index}>
                  <div style={{ textAlign: "left" }}>
                    <Text strong>{item.key}:</Text>
                    <div style={{ display: "flex", textAlign: "left" }}>
                      <Text style={{ marginLeft: "8px" }}>{item.value}</Text>
                      <Tooltip title="Copy to clipboard">
                        <CopyOutlined
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            color: "lightsteelblue",
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(item.value);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Card>
    </ConfigProvider>
  );
};

export default BasicWidget;
