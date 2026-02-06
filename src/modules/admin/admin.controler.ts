 
 import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";

 
   const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await adminService.getAllUsersService()
    return res.json({ users })
  } catch (err) {
    console.error("Get All Users Error:", err)
    return res.status(500).json({ error: "Something went wrong" })
  }
}



// manage users
  const manageUsers = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const { status } = req.body;

    // Validate ID type
    if (!idParam || Array.isArray(idParam)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const id: string = idParam;

    // Validate status
    if (!["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedUser = await adminService.manageUser(id, status);

    return res.json({
      message: `User status updated to ${status}`,
      user: updatedUser
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update user status" });
  }
};



// get all bookings
// src/modules/admin/admin.controller.ts

 
  const getAllBookings = async (req: Request, res: Response, next:NextFunction)=> {
    try {
      const bookings = await adminService.viewAllBookings();
      return res.json(bookings);
    } catch (err) {
     next(err)
    }
  }



  
 
  // Create category
  const createCategory = async(req: Request, res: Response)=> {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const category = await adminService.createCategory(name);
      return res.json({ message: "Category created", category });
    } catch (err) {
      return res.status(500).json({ message: "Failed to create category" });
    }
  }

  // Update
  const updateCategory = async(req: Request, res: Response)=> {
    try {
      const idParam = req.params.id;
      const { name } = req.body;

      if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const category = await adminService.updateCategory(idParam, name);
      return res.json({ message: "Category updated", category });
    } catch (err) {
      return res.status(500).json({ message: "Failed to update category" });
    }
  }

  // Delete
 const deleteCategory = async(req: Request, res: Response)=> {
    try {
      const idParam = req.params.id;

      if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      await adminService.deleteCategory(idParam);
      return res.json({ message: "Category deleted" });
    } catch (err) {
      return res.status(500).json({ message: "Failed to delete category" });
    }
  }

  

 
 
 export const adminControler = {
   getAllUsersController,
   manageUsers,
   getAllBookings,
   createCategory,
   updateCategory,
   deleteCategory,
   
}

