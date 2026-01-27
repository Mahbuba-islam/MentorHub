import { TutorProfile } from "@prisma/client";
import { prisma } from "../../lib/prisma";


const createTutors = async (data:TutorProfile) => {
    console.log(data);
 const results = await prisma.tutorProfile.create({
    data
 })
 return results
} 


export const tutorsService = {
    createTutors
}