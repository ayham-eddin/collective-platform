import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../../services/auth.service";

export const ProtectedAdminRoute = () => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
