import { authService } from "./authentication.service";
import { Request, Response } from "express";


export const authController = {
  async register(req:Request, res:Response) {
    try {
      const { userId, name, email, role } = req.body;

      const updatedUser = await authService.updateUserRole({
        userId,
        name,
        email,
        role,
      });

      return res.json({
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update role",
      });
    }
  },
};