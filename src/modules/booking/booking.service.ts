

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





const createBooking = async (data, studentId) => {
  return prisma.booking.create({
    data: {
      tutorId: data.tutorId,
      studentId: studentId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      status: "CONFIRMED",
    },
  });
};


export const bookingService = {
    getAllBookingsForStudent,
    createBooking
}