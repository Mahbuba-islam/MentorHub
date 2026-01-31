
import { Booking } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { BookingCreateInput } from "../../utils/bookingType";


// get booking with upcoming and past



// const getAllBookingsForStudent = async (studentId: string) => {
//   const now = new Date();

//   // Upcoming bookings
//   const upcoming = await prisma.booking.findMany({
//     where: {
//       studentId,
//       date: { gte: now },
//       status: "CONFIRMED"
//     },
//     // include: {
//     //   tutor: {
//     //     include: {
//     //       user: { select: { name: true, image: true } }
//     //     }
//     //   }
//     // },
//     orderBy: { date: "asc" }
//   });

//   // Past bookings
//   const past = await prisma.booking.findMany({
//     where: {
//       studentId,
//       OR: [
//         { date: { lt: now } },
//         { status: "COMPLETED" }
//       ]
//     },
//     // include: {
//     //   tutor: {
//     //     include: {
//     //       user: { select: { name: true, image: true } }
//     //     }
//     //   }
//     // },
//     orderBy: { date: "desc" }
//   });

//   return { upcoming, past };
// };

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
  return prisma.booking.create({
    data: {
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      tutorId: data.tutorId,
      studentId: data.studentId,
      status: data.status ?? "CONFIRMED",
    },
  });
};


export const bookingService = {
    getAllBookingsForStudent,
    createBooking
}