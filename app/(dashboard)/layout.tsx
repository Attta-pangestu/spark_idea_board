import { CreateOrganization } from "@clerk/nextjs";
import Navbar from "./_components/navbar/Navbar";
import Sidebar from "./_components/sidebar";
import OrgSideBar from "./_components/orgsidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full w-full">
      <Sidebar />
      <div className="pl-[60px] h-full ">
        <div className="flex gap-x-3 h-full ">
          <OrgSideBar />
          <div className="h-full flex-1  ">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
