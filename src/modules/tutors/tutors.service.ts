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

const getTutorDashboardData = async (tutorId: string) => {
  const now = new Date();

  // Upcoming sessions
  const upcoming = await prisma.booking.findMany({
    where: {
      tutorId,
      date: { gte: now },
      status: "CONFIRMED"
    },
    include: {
      student: { select: { name: true, image: true } }
    },
    orderBy: { date: "asc" }
  });

  // Past sessions
  const past = await prisma.booking.findMany({
    where: {
      tutorId,
      OR: [
        { date: { lt: now } },
        { status: "COMPLETED" }
      ]
    },
    include: {
      student: { select: { name: true, image: true } }
    },
    orderBy: { date: "desc" }
  });

  // Stats
  const totalSessions = await prisma.booking.count({ where: { tutorId } });

  const totalStudents = await prisma.booking.findMany({
    where: { tutorId },
    select: { studentId: true },
    distinct: ["studentId"]
  });

  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    select: {
      rating: true,
      totalReviews: true
    }
  });

  return {
    sessions: {
      upcoming,
      past
    },
    stats: {
      totalSessions,
      totalStudents: totalStudents.length,
      averageRating: tutorProfile?.rating || 0,
      totalReviews: tutorProfile?.totalReviews || 0,
      upcomingCount: upcoming.length,
      pastCount: past.length
    }
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


export const tutorsService = {
    getTutors ,
    getTutorDetails,
    findFeaturedTutors ,
    createTutors,
    getTutorDashboardData

}