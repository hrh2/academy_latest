import {Routes, Route, Outlet} from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import {useInput} from "@/context/InputContext.jsx";
import {useDebounce} from "use-debounce";
import SearchComponent from "@/components/SearchDisplayer.jsx";
import {useEffect, useState} from "react";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { inputValue } = useInput();
  const [searchInput] = useDebounce(inputValue, 1000);
    const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
  if (searchInput && searchInput.length >= 3) {
    setShowSearch(true);
  }
}, [searchInput]);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
        brandName={"PMS"}
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
          {showSearch && (
  <SearchComponent
    searchKeyword={searchInput}
    onClose={() => setShowSearch(false)}
  />
)}

        <Outlet/>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
