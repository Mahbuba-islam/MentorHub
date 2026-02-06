import { prisma } from "../../lib/prisma";

 const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
     role: true
    }
  });
};





const updateProfile = async (
  userId: string,
  data: { name?: string; email?: string; image?: string; bio?: string, phone:string }
) => {
  return prisma.user.update({
    where: { id: userId },
   data: {
  ...(data.name !== undefined && { name: data.name }),
  ...(data.email !== undefined && { email: data.email }),
  ...(data.image !== undefined && { image: data.image }),
  ...(data.bio !== undefined && { bio: data.bio }),
  ...(data.phone !== undefined && { phone: data.phone ?? "" })
},

    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone:true
    },
  });
};



//get upcoming session
const upComingBookings = async(studentId:string)=> {
const bookings = await prisma.booking.findMany({
      where: {
        studentId,
        date: {
          gte: new Date(), 
        },
      },
     include: {
  tutor: {
    include: {
      user: true
    }
  }
},
      
      orderBy: {
        date: "asc",
      },
    });

return bookings
}




const getPastBookings = async(studentId:string)=> {
const bookings = await prisma.booking.findMany({
      where: {
        studentId,
        date: {
          lt: new Date(), 
        },
      },
      include: {
      tutor: {
      include: {
      user: true
     }
   }
  },
      orderBy: {
        date: "asc",
      },
    });

return bookings
}


// bookings status change

const markCompleted = async (bookingId: string, studentId: string) => {
  // 1. Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2. Ownership check
  if (booking.studentId !== studentId) {
    throw new Error("Unauthorized");
  }

  // 3. Already completed check
  if (booking.status === "COMPLETED") {
    throw new Error("Already completed");
  }

  // 4. Update status
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  return updated;
};

export const bookingService = {
  markCompleted,
};





 
  const deleteAccount = async (userId: string) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to delete account" };
  }
};


export const studentService = {
  getProfile,
 updateProfile,
 upComingBookings,
 getPastBookings,
 markCompleted,
 deleteAccount
}