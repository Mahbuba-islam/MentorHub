import { TutorProfile } from "@prisma/client";
import { prisma } from "../../lib/prisma";




//get tutors
const getTutors = async (payload: {
  search?: string | undefined,
  categoryName?: string | undefined
}) => {
  const { search, categoryName } = payload;

  const num = Number(search);
  const isNumber = !isNaN(num);

  return prisma.tutorProfile.findMany({
    where: {
      AND: [
        // category filter (optional)
        categoryName
          ? {
              category: {
                name: {
                  equals: categoryName,
                  mode: "insensitive"
                }
              }
            }
          : {},

        // search filter (optional)
        search
          ? {
              OR: [
                // subject search
                {
                  subject: {
                    has: search
                  }
                },

                // rating search
                isNumber ? { rating: { equals: num } } : {},

                // price search
                isNumber ? { price: { equals: num } } : {}
              ]
            }
          : {}
      ]
    },
     include: {
      category: true
    }

  });
};


//get tutor details
const getTutorDetails = async(id:string) => {
  const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true }
        },
        reviews: {
          include: {
            student: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    return tutor;

}




// featured tutors

 const findFeaturedTutors = async () => {
  return prisma.tutorProfile.findMany({
    where: { isFeatured: true },
    include: {
      user: {
        select: { name: true, email: true, image: true }
      },
      category: {
        select: { name: true }
      }
    },
    orderBy: { rating: "desc" }
  });
};



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
    getTutorDetails,
    findFeaturedTutors ,
    createTutors

}