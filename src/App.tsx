import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.scss";
import DashboardPage from "@pages/Dashboard/DashboardPage";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {},
        token: {
          borderRadius: 11,
          colorPrimary: "#139696",
        },
      }}
    >
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<div>Not found</div>} />
          </Routes>
        </Router>
      </div>
    </ConfigProvider>
  );
}

export default App;
