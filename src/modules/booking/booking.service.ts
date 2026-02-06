

import { Booking } from "../../generated/client";
import { prisma } from "../../lib/prisma";



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





const createBooking = async (data:Booking, studentId:string) => {
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





  const deleteBooking = async(id: string) => {
    return await prisma.booking.delete({
      where: { id },
    });
  }

 


export const bookingService = {
    getAllBookingsForStudent,
    createBooking,
    deleteBooking
}