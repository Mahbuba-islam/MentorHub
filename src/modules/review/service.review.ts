import {  Review } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createReview= async (data:Review, id:string) => {
   
    console.log(data);
 const results = await prisma.review.create({
   data:{
    ...data,
    id
   }
 })
 return results
} 


export const reviewService  = {
    createReview
}