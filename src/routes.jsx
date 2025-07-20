import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon, BookOpenIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import {SignIn, SignUp, Verification} from "@/pages/auth";
import ResetPassword from "@/pages/auth/ResetPassword.jsx";
import Admin from "@/pages/dashboard/Admin.jsx";
import {SiGoogleclassroom} from "react-icons/si";
import Classes from "@/pages/dashboard/Classes.jsx";
import Courses from "@/pages/dashboard/courses/Courses.jsx";
import Course from "@/pages/dashboard/courses/Course.jsx";
import Tasks from "@/pages/dashboard/tasks/Tasks.jsx";
import Quiz from "@/pages/dashboard/tasks/Quiz.jsx";
import {GrTask} from "react-icons/gr";

const icon = {
  className: "w-5 h-5 text-inherit",
};
export const routes = [
  {
    title: "ADMIN",
    layout: "ADMIN",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/",
        protected: true,
        roles: ["ADMIN"],
        element:<Admin />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        protected: true,
        roles:  ["ADMIN"],
        element: <Tables />,
      },
    ],
  },
  {
    title: "STANDARD",
    layout: "NORMAL",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/",
        protected: true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Home/>,
      },
      {
        icon: <SiGoogleclassroom  {...icon} />,
        name: "classes",
        path: "/classes",
        protected: true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Classes/>,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "My course",
        path: "/courses",
        protected: true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Courses/>,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "My course",
        path: "/courses/:courseID",
        protected: true,
        hide:true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Course/>,
      },
      {
        icon: <GrTask {...icon} />,
        name: "Tests and Tasks",
        path: "/tasks",
        protected: true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Tasks/>,
      },
      {
        icon: <GrTask {...icon} />,
        name: "Quiz",
        path: "/tasks/:id",
        protected: true,
        hide: true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Quiz/>,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        protected: true,
        roles:  ["ADMIN", "NORMAL", "SPECIAL"],
        element: <Profile />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/auth/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/auth/sign-up",
        element: <SignUp />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "OTP",
        path: "/auth/otp/",
        element: <Verification />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Reset password",
        path: "/auth/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
];

export default routes;
