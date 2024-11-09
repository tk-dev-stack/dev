import DataConfig from "./DataConfig/DataConfig";
import "./Dashboard.scss";
import UIConfig from "./UIConfig/UIConfig";
import { Col, Row } from "antd";

import Preview from "./Preview/Preview";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard--wrapper">
      <Row className="dashboard-container">
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={8}
          xl={6}
          className="panel panel-data-config"
        >
          <DataConfig />
        </Col>
        <Col
          xs={12}
          sm={24}
          md={12}
          lg={8}
          xl={9}
          className="panel panel-preview"
        >
          <Preview />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={8}
          xl={9}
          className="panel panel-ui-config"
        >
          <UIConfig />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
