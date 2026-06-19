import { permissionActions, permissionModules } from "../adminAdmins.constants";
import type {
  Permission,
  PermissionAction,
  PermissionModule,
} from "../adminAdmins.types";

interface PermissionEditorProps {
  permissions: Permission[];
  onToggle: (moduleName: PermissionModule, action: PermissionAction) => void;
}

export const PermissionEditor = ({
  permissions,
  onToggle,
}: PermissionEditorProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead className="bg-white/[0.04] text-left text-sm text-zinc-400">
            <tr>
              <th className="px-4 py-3">Module</th>
              {permissionActions.map((action) => (
                <th key={action} className="px-4 py-3 capitalize">
                  {action}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {permissionModules.map((moduleName) => {
              const currentPermission = permissions.find(
                (permission) => permission.module === moduleName,
              );

              return (
                <tr key={moduleName}>
                  <td className="px-4 py-3 text-sm font-black text-white">
                    {moduleName}
                  </td>

                  {permissionActions.map((action) => (
                    <td key={action} className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          currentPermission?.actions.includes(action) || false
                        }
                        onChange={() => onToggle(moduleName, action)}
                        className="h-5 w-5"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
