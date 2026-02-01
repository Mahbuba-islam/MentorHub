

import { prisma } from "../../lib/prisma";
import { BookingCreateInput } from "../../utils/bookingType";




const getAllBookingsForStudent = async () => {
  
    try {
   const results = await prisma.booking.findMany({
    where: {
     
      
      status: "CONFIRMED"
    },
    
    orderBy: { date: "asc" }
  });
  return results
} catch (err) {
  console.error("Prisma error:", err);
  throw err;
}

    
}












 const createBooking = async (data: BookingCreateInput) => {
  // Step 1: find tutor profile by userId
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: data.tutorId },
  });

  if (!profile) {
    throw new Error("Tutor profile not found");
  }

  // Step 2: create booking with TutorProfile.id
  return prisma.booking.create({
    data: {
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      tutorId: profile.id,       // ✔ এখন সঠিক TutorProfile.id যাচ্ছে
      studentId: data.studentId,
      status: "CONFIRMED",
    },
  });
};


export const bookingService = {
    getAllBookingsForStudent,
    createBooking
}