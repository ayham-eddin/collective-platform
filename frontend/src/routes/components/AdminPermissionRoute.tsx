import { Navigate, Outlet } from "react-router-dom";
import { getStoredAdmin } from "../../services/auth.service";
import type {
  PermissionAction,
  PermissionModule,
} from "../../types/admin.types";
import { hasPermission } from "../../utils/permissions";

interface AdminPermissionRouteProps {
  moduleName: PermissionModule;
  action: PermissionAction;
}

export const AdminPermissionRoute = ({
  moduleName,
  action,
}: AdminPermissionRouteProps) => {
  const admin = getStoredAdmin();

  if (!hasPermission(admin, moduleName, action)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
