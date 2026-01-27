import { Category } from "@prisma/client";
import { prisma } from "../../lib/prisma";


const createCategory = async (data:Category) => {
    console.log(data);
 const results = await prisma.category.create({
    data
 })
 return results
} 


export const categoryService = {
    createCategory
}