import {Routes, Route, Outlet} from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";

export function Auth() {

  return (
    <div className="relative min-h-screen w-full">
      <Outlet/>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
