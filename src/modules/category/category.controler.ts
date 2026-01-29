import {  Request, Response } from "express";
import { categoryService } from "./category.service";

// Get all
  
const getAllCategories = async(req: Request, res: Response) => {
    try {
      const categories = await categoryService.getAllCategories();
      return res.json(categories);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  }

  export const categoryControler = {
  getAllCategories
   
}