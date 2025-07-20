import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import routes from "@/routes.jsx";
import PrivateRoute from "@/components/PrivateRoute";
import {Spinner} from "@material-tailwind/react";
import {useAuth} from "@/context/AuthContext.jsx";

function App() {
    const { loading ,userData } = useAuth();

    if (loading) return <Spinner />;

    const userRole = () => {
        return userData && userData.role;
    }

  return (
    <Routes>

      <Route path="/auth" element={<Auth />}>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }, i) => (
              <Route key={i} path={`${path}`} element={element} />
            ))
        )}
      </Route>

      <Route path="/" element={<Dashboard />}>
        {routes.map(
          ({ layout, pages }) =>
            layout === userRole() &&
            pages.map(({ path, element, protected: isProtected, roles }, i) => (
              <Route
                key={i}
                path={path}
                element={
                  isProtected ? (
                    <PrivateRoute allowedRoles={roles}>{element}</PrivateRoute>
                  ) : (
                    element
                  )
                }
              />
            ))
        )}
      </Route>

      <Route path="/unauthorized" element={<div>Unauthorized</div>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
