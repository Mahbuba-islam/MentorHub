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




//get tutor dashboard data

  const getTutorDashboard = async (tutorId: string) => {
  const now = new Date();

  // 1. Full tutor profile with all info
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorId },
    include: {
      user: true,        // name, email, image
      category: true,    // category name
      reviews: true,     // all reviews
      bookings: {
        include: {
          student: true
          
        },
        orderBy: { date: "asc" }
      }
    }
  });

  if (!profile) throw new Error("Tutor profile not found");

  // 2. Split bookings into upcoming + past
  const upcomingSessions = profile.bookings.filter(
    (b) => b.date >= now
  );

  const pastSessions = profile.bookings.filter(
    (b) => b.date < now
  );

  // 3. Fetch all reviews separately (with student info)
  const reviews = await prisma.review.findMany({
    where: { tutorId },
    include: {
      student: true
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    profile,             // full tutor profile
    upcomingSessions,    // future classes
    pastSessions,        // completed classes
    reviews,             // all reviews
    rating: profile.rating || 0,
    totalReviews: profile.totalReviews || 0
  };
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




// update tutors 

const updateTutorProfile = async (
  userId: string,
  data: { bio?: string; price?: number; subject?: string[]; categoryId?: string }
) => {
  return prisma.tutorProfile.update({
    where: { userId },
    data: {
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.subject && { subject: data.subject }), // string[]
    },
    include: {
      user: true,
      category: true,
    },
  });
};



// set availbility slots
 const updateAvailability = async (
  userId: string,
  data: { date: string; timeSlots: string[] }
) => {
  const { date, timeSlots } = data;

  // Check if availability exists for this date
  const existing = await prisma.availability.findFirst({
    where: {
      tutorId: userId,
      date: new Date(date),
    },
  });

  if (existing) {
    // Update existing availability
    return prisma.availability.update({
      where: { id: existing.id },
      data: { timeSlots },
    });
  }

  // Create new availability
  return prisma.availability.create({
    data: {
      tutorId: userId,
      date: new Date(date),
      timeSlots,
    },
  });
};


export const tutorsService = {
    getTutors ,
    getTutorDetails,
    findFeaturedTutors ,
    createTutors,
    getTutorDashboard,
    updateTutorProfile,
    updateAvailability

}