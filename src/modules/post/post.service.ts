import { Post } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data:Omit<Post, "id" | "createdAt" | "updatedAt">) => {
 const results = await prisma.post.create({
    data
})
 return results
} 


export const postServices = {
    createPost
}