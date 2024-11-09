import libraries from "@constants/ui-libraries";
import { Checkbox, Select } from "antd";
import { DATABASE_OPTIONS } from "@constants/databases";
import "./Footer.scss";
import { useSelector } from "react-redux";
import { RootState } from "src/Redux/store";
import { useDispatch } from "react-redux";
import {
  setDatabase,
  toggleIncludeDDLCommands,
} from "src/Redux/Dashboard/dashboard.reducer";

const Footer = () => {
  const dispatch = useDispatch();
  // const [includeDDLCommands, setIncludeDDLCommands] = useState(false);
  const includeDDLCommands = useSelector(
    (state: RootState) => state.dashboard.includeDDLCommands
  );
  const database = useSelector((state: RootState) => state.dashboard.database);
  // const [database, setDatabase] = useState(DatabaseType.MYSQL);

  return (
    <div className="dashboard__footer__container">
      <div className="dashboard__footer__item">
        <Checkbox
          checked={includeDDLCommands}
          onChange={() => dispatch(toggleIncludeDDLCommands())}
        >
          Include DDL commands
        </Checkbox>
      </div>
      <div className="dashboard__footer__item">
        Database:
        <Select
          style={{ width: "145px" }}
          disabled={!includeDDLCommands}
          variant="outlined"
          className="dashboard--dropdown"
          value={database}
          onChange={(e) => {
            dispatch(setDatabase(e));
            // setDatabase(e);
          }}
          options={DATABASE_OPTIONS}
        />
      </div>
      <div className="dashboard__footer__item">
        UI Library:
        <Select
          variant="outlined"
          className="dashboard--dropdown"
          defaultValue={libraries[0].value}
          options={libraries}
        />
      </div>
    </div>
  );
};

export default Footer;
