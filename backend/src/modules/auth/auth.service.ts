import { Admin } from "../../database/models/Admin";
import { comparePassword } from "../../utils/password";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

interface LoginInput {
  email: string;
  password: string;
}

export const loginAdmin = async ({ email, password }: LoginInput) => {
  const admin = await Admin.findOne({ email: email.toLowerCase() })
    .select("+password")
    .populate("role");

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  if (!admin.isActive) {
    throw new Error("Admin account is disabled");
  }

  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const role = admin.role as unknown as {
    _id: string;
    name: string;
    isSuperAdmin: boolean;
  };

  const accessToken = signAccessToken({
    adminId: admin._id.toString(),
    roleId: role._id.toString(),
  });

  const refreshToken = signRefreshToken({
    adminId: admin._id.toString(),
    roleId: role._id.toString(),
  });

  return {
    admin: {
      id: admin._id.toString(),
      email: admin.email,
      fullName: admin.fullName,
      role: {
        id: role._id.toString(),
        name: role.name,
        isSuperAdmin: role.isSuperAdmin,
      },
    },
    accessToken,
    refreshToken,
  };
};
