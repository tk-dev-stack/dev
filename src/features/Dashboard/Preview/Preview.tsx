/* eslint-disable @typescript-eslint/no-unused-vars */
import { RootState } from "src/Redux/store";
import BasicWidgetPreview from "./components/basic-widget/BasicWidgetPreview";
import "./Preview.scss";
import { Button, ConfigProvider, Select } from "antd";
import { useSelector } from "react-redux";
import { generateJSONFromFormObject } from "@utils/generateJson";
import { widgetOptions, WidgetType } from "@constants/widgets";
import { jsonToJsx } from "@utils/export/basicWidget-export/JsontoJSXConverter";
import JSZip from "jszip";
import { basicWidgetStyles } from "src/styles/basicWidget.styles";
import _ from "lodash";
import axios from "axios";
import FormWidgetPreview from "./components/form/FormWidgetPreview";
import TablePreview from "./components/table/TablePreview";
import { exportTable } from "@utils/export/table-export/JsontoJSXConverter";
import { useDispatch } from "react-redux";
import { updateWidgetType } from "src/Redux/Dashboard/dashboard.reducer";
import { exportForm } from "@utils/export/form-export/JsontoJSXConverter";
import ListPreview from "./components/list/ListPreview";
import { formWidgetStyles } from "src/styles/formWidget.styles";
import { exportList } from "@utils/export/list-export/listExport";
import LeftPanelPreview from "./components/left-panel/LeftPanelPreview";
import NavbarPreview from "./components/navbar/NavbarPreview";
import CardPreview from "./components/card/CardPreview";

const Preview: React.FC = () => {
  const dispatch = useDispatch();
  // const [widgetType, setWidgetType] = useState(WidgetType.BasicWidget);

  const fieldData = useSelector(
    (state: RootState) => state.dashboard.fieldData
  );
  const widgetType = useSelector(
    (state: RootState) => state.dashboard.fieldData.widgetType
  );

  const includeDDLCommands = useSelector(
    (state: RootState) => state.dashboard.includeDDLCommands
  );
  const formButtonStyles = useSelector(
    (state: RootState) => state.dashboard.formAction.submit
  );

  // const database = useSelector((state: RootState) => state.dashboard.database);

  const getCSSContent = (widgetType: string) => {
    switch (widgetType) {
      case WidgetType.BasicWidget:
        return basicWidgetStyles;
      case WidgetType.Form:
        return formWidgetStyles;
      // Add more cases as needed for other widget types
      default:
        return ""; // Return an empty string or a default style
    }
  };

  const fetchDDlStatement = async () => {
    const response = await axios.post("http://localhost:3001/query", fieldData);
    return response;
  };

  const handleExportClick = async () => {
    const fields = { ...fieldData, widgetType: widgetType };
    const jsonData = generateJSONFromFormObject(fields);

    let jsxCode: string;
    if (widgetType === WidgetType.BasicWidget) {
      jsxCode = jsonToJsx(jsonData);
    } else if (widgetType === WidgetType.List) {
      jsxCode = exportList(jsonData);
    } else if (widgetType === WidgetType.Table) {
      jsxCode = exportTable(jsonData);
    } else if (widgetType === WidgetType.Form) {
      jsxCode = exportForm(jsonData, formButtonStyles);
    } else {
      jsxCode = "Faild to generate jsx";
    }

    console.log("JSX=", jsxCode);

    let ddlStatement: string = "";
    if (includeDDLCommands) {
      try {
        const response = await fetchDDlStatement();
        ddlStatement = response.data;
        console.log(ddlStatement);
      } catch (error) {
        console.log(error);
      }
    }
    // console.log(jsxCode);
    const zip: JSZip = new JSZip();
    if (zip) {
      const widgetsFolder = zip.folder("widgets");
      const stylesFolder = zip.folder("styles");
      const utilsFolder = zip.folder("utils");
      const viewsFolder = zip.folder("views");
      if (ddlStatement) {
        const ddlFolder = zip.folder("DDL");
        if (ddlFolder) {
          ddlFolder.file(`${_.camelCase(jsonData.title)}.sql`, ddlStatement);
        }
      }
      if (widgetsFolder) {
        const widgetTypeFolder = widgetsFolder.folder(`${jsonData.widgetType}`);
        if (widgetTypeFolder) {
          widgetTypeFolder.file(`${_.camelCase(jsonData.title)}.jsx`, jsxCode);
        }
      }
      if (stylesFolder) {
        const cssContent = getCSSContent(jsonData.widgetType);
        stylesFolder.file(`${jsonData.widgetType}.css`, cssContent);
      }
      if (utilsFolder && viewsFolder) {
        utilsFolder.file("utils.txt");
        viewsFolder.file("views.txt");
      }
      const zipContent = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipContent);
      link.download = `${_.camelCase(fieldData.widgetTitle)}${
        fieldData.widgetType
      }.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Failed to create 'src' folder in the zip.");
    }
  };

  function returnPreviewWidget(widgetType: WidgetType) {
    console.log(widgetType);
    switch (widgetType) {
      case WidgetType.BasicWidget:
        return <BasicWidgetPreview fieldData={fieldData} />;
      case WidgetType.Table:
        return <TablePreview fieldData={fieldData} />;
      case WidgetType.Form:
        return <FormWidgetPreview />;
      case WidgetType.List:
        return <ListPreview fieldData={fieldData} />;
      case WidgetType.LeftPanel:
        return <LeftPanelPreview fieldData={fieldData} />;
      case WidgetType.NavBar:
        return <NavbarPreview fieldData={fieldData} />;
      case WidgetType.Card:
        return <CardPreview fieldData={fieldData} />;
      default:
        return <div>Coming soon...</div>;
    }
  }

  return (
    <div className="preview__container">
      <div className="preview__header">
        <Select
          value={widgetType}
          // onChange={(value) => setWidgetType(value as WidgetType)}
          onChange={(value) => dispatch(updateWidgetType(value))}
          className="preview__widget--dropdown"
          size="large"
          defaultValue={WidgetType.BasicWidget}
          options={widgetOptions}
        />
        <Select
          style={{ width: "150px" }}
          defaultValue={"react18"}
          options={[
            { value: "react18", label: "ReactJS v18.3.1" },
            { value: "Angular", label: "Angular v18.2.10", disabled: true },
          ]}
        />
        <Select
          style={{ width: "110px" }}
          defaultValue={"vanillaCss"}
          options={[
            { value: "vanillaCss", label: "Vanilla CSS" },
            { value: "sass", label: "sass", disabled: true },
            { value: "sass", label: "sass", disabled: true },
          ]}
        />
        <Button onClick={handleExportClick} type="primary">
          Export
        </Button>
      </div>
      <div className="preview__content">
        <ConfigProvider
          theme={{
            // algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
            token: {
              colorBgContainer: fieldData.darkMode ? "#333" : "#fff", // Background for containers
              colorTextBase: fieldData.darkMode ? "#fff" : "#000", // Base text color
              colorTextSecondary: fieldData.darkMode ? "#b0b0b0" : "#595959", // Secondary text color
              colorBorder: fieldData.darkMode ? "#444" : "#d9d9d9", // Border color
              // Add styles for dropdown specifically
              colorBgElevated: fieldData.darkMode ? "#333" : "#fff", // Background for dropdown menu
              colorText: fieldData.darkMode ? "#fff" : "#000", // Text color in dropdown menu
            },
          }}
        >
          {returnPreviewWidget(widgetType as WidgetType)}
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Preview;
