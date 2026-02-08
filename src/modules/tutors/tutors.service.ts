import { prisma } from "../../lib/prisma";
import { CreateTutorProfileInput } from "../../utils/tutor.types";





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
      category: true,
      user: true,  
    }
  });
};


//get tutor details
const getTutorDetails = async (id: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          email: true
        }
      },
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
};



// featured tutors

 const findFeaturedTutors = async () => {
  
  return prisma.tutorProfile.findMany({
    where: {
      isFeatured: true
     
    },

    include: {
      category: true,
      user: true,
    },
  });
};

//get tutor dashboard data

  const getTutorDashboard = async (tutorId: string) => {
  const now = new Date();

  // 1. Full tutor profile with all info
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorId },
    include: {
      user: true,        
      category: true,    
      reviews: true,     
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
    profile,             
    upcomingSessions,    
    pastSessions,        
    reviews,            
    rating: profile.rating || 0,
    totalReviews: profile.totalReviews || 0
  };
};



const createTutors = async (
  raw: CreateTutorProfileInput,
  userId: string
) => {
  const data: CreateTutorProfileInput & { userId: string } = {
    bio: raw.bio ?? null,
    price: raw.price !== undefined ? Number(raw.price) : null,
    categoryId: raw.categoryId,
    isFeatured: raw.isFeatured ?? false,
    subject: Array.isArray(raw.subject) ? raw.subject : [],
    userId,
  };

  console.log("FINAL DATA SENT TO PRISMA:", data);

  return prisma.tutorProfile.create({
    data,
    include: {
      user: true,
      category: true,
    },
  });
};

 
  // update tutors 

const updateTutorProfile = async (
  userId: string,
  raw: {
    bio?: string;
    price?: number;
    subject?: string[];
    categoryId?: string;
    isFeatured?: boolean;
  }
) => {
  const data: any = {};

  if (raw.bio !== undefined) data.bio = raw.bio;
  if (raw.price !== undefined) data.price = Number(raw.price);
  if (raw.categoryId !== undefined) data.categoryId = raw.categoryId;
  if (Array.isArray(raw.subject)) data.subject = raw.subject;
  if (raw.isFeatured !== undefined) data.isFeatured = raw.isFeatured;

  console.log("FINAL UPDATE DATA:", data);

  return prisma.tutorProfile.update({
    where: { userId },
    data,
    include: {
      user: true,
      category: true,
    },
  });
};


const getTutorReviews = async (userId: string) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) throw new Error("Tutor profile not found");

  return prisma.review.findMany({
    where: { tutorId: profile.id },
    include: {
      student: true,
    },
    orderBy: { createdAt: "desc" },
  });
};



  // -----------------------------
  // GET ALL AVAILABILITY
  // -----------------------------
  const getAvailability = async (userId: string) => {
    // find tutor profile
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
   
    if (!profile) {
      throw new Error("Tutor profile not found");
    }

    // fetch all availability for this tutor
    return prisma.availability.findMany({
      where: { tutorId: profile.id },
      orderBy: { date: "asc" },
    });
  }





  const getTutorSessions = async (userId: string) => {
    // find tutor profile
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("Tutor profile not found");
    }

    // fetch all bookings (sessions)
    return prisma.booking.findMany({
      where: { tutorId: profile.id },
      orderBy: { date: "asc" },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }








// set availbility slots
 const updateAvailability = async (
  userId: string,
  data: { date: string; timeSlots: string[] }
) => {
  const { date, timeSlots } = data;

  // 1. Get tutor profile by userId
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Tutor profile not found");
  }

  // 2. Check if availability exists for this date
  const existing = await prisma.availability.findFirst({
    where: {
      tutorId: profile.id, // FIXED
      date: new Date(date),
    },
  });

  if (existing) {
    return prisma.availability.update({
      where: { id: existing.id },
      data: { timeSlots },
    });
  }

  // 3. Create new availability
  return prisma.availability.create({
    data: {
      tutorId: profile.id, // FIXED
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
    updateAvailability,
    getTutorSessions,
    getAvailability,
    getTutorReviews
    

}