import { prisma } from "../../lib/prisma";

// Get all categories
   const getAllCategories = async() => {
    return prisma.category.findMany({
      orderBy: { name: "asc" }
    });
  }


  export const categoryService = {
  getAllCategories
}