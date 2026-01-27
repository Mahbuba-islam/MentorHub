import { TutorProfile } from "@prisma/client";
import { prisma } from "../../lib/prisma";




//get tutors

const getTutors = async () => {
  const results = await prisma.tutorProfile.findMany({
    
    
 })
 return results
} 



//create tutors

const createTutors = async (data:TutorProfile, userId:string) => {
    console.log(data);
 const results = await prisma.tutorProfile.create({
    data:{
        ...data,
        userId:userId

    }
    
 })
 return results
} 


export const tutorsService = {
    getTutors ,
    createTutors

}