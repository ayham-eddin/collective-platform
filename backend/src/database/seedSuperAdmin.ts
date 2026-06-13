import { env } from "../config/env";
import { Admin } from "./models/Admin";
import { Role } from "./models/Role";
import { hashPassword } from "../utils/password";

export const seedSuperAdmin = async (): Promise<void> => {
  if (!env.superAdminEmail || !env.superAdminPassword) {
    console.log(
      "Super admin seed skipped: missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD",
    );
    return;
  }

  const existingSuperAdminRole = await Role.findOne({ isSuperAdmin: true });

  const superAdminRole =
    existingSuperAdminRole ||
    (await Role.create({
      name: "Super Admin",
      isSuperAdmin: true,
      permissions: [],
    }));

  const existingAdmin = await Admin.findOne({
    email: env.superAdminEmail.toLowerCase(),
  });

  if (existingAdmin) {
    console.log("Super admin already exists");
    return;
  }

  const hashedPassword = await hashPassword(env.superAdminPassword);

  await Admin.create({
    email: env.superAdminEmail.toLowerCase(),
    password: hashedPassword,
    fullName: env.superAdminFullName,
    role: superAdminRole._id,
    isActive: true,
  });

  console.log("Super admin created successfully");
};
