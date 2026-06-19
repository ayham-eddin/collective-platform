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
  superAdminOnly?: boolean;
}

export const AdminPermissionRoute = ({
  moduleName,
  action,
  superAdminOnly = false,
}: AdminPermissionRouteProps) => {
  const admin = getStoredAdmin();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (superAdminOnly && !admin.role.isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!hasPermission(admin, moduleName, action)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
