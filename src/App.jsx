import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import routes from "@/routes.jsx";
import PrivateRoute from "@/components/PrivateRoute";
import Loader from "@/components/Loader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import ErrorPage from "@/pages/auth/ErrorPage.jsx";

function App() {
    const { loading, userData } = useAuth();

    if (loading) return <Loader />;


    const userRole = () => {
        return userData?.role;
    }

    const isAdmin = () => {
        return userData && userData.role !== 'NORMAL';
    }

    return (
        <Routes>

            {/* Auth Layout Routes */}
            <Route path="/auth" element={<Auth />}>
                {routes.map(
                    ({ layout, pages }) =>
                        layout === "auth" &&
                        pages.map(({ path, element }, i) => (
                            <Route key={i} path={path} element={element} />
                        ))
                )}
            </Route>
            <Route path="/" element={userData?<Dashboard />:<Navigate to="/auth/sign-in" />}>
            {/* Main App Routes */}
            {
                isAdmin() ? (
                    // Admin sees all routes without layout filtering
                    routes.flatMap(({ pages }) =>
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
                    )
                ) : (
                    // Normal users see routes based on their layout
                        routes.map(
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
                        )
                )
            }
                    </Route>

            {/* Fallback Routes */}
            <Route path="/unauthorized" element={<ErrorPage/>} />
        </Routes>
    );
}

export default App;
