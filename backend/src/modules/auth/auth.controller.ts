import { Request, Response } from "express";
import { loginAdmin } from "./auth.service";

export const loginController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { email, password } = request.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    response.status(400).json({
      success: false,
      message: "Email and password are required",
    });
    return;
  }

  const result = await loginAdmin({ email, password });

  response.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
};
