import { ReactNode } from "react";
import "./DashboardLayout.scss";
import Footer from "@features/Footer/Footer";
interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <main className="dashboardlayout__container">
      <div className="dashboardlayout__content">{children}</div>
      <div className="dashboardlayout__footer">
        <Footer />
      </div>
    </main>
  );
};

export default DashboardLayout;
