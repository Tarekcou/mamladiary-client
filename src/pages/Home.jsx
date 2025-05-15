import Header from "../components/Header";
import SidebarLeft from "../components/SidebarLeft";
import SidebarRight from "../components/SidebarRight";
import CaseSearchForm from "../components/CaseSearchForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="w-10/12 mx-auto">
      <Header />
      <div className="flex bg-gray-100 min-h-screen">
        <SidebarLeft />
        <div className="flex-1 p-4">
          <CaseSearchForm />
        </div>
        <SidebarRight />
      </div>
      <Footer />
    </div>
  );
}
