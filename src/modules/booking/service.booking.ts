
import { Booking } from "@prisma/client";
import { prisma } from "../../lib/prisma";


// get booking with upcoming and past



const getAllBookingsForStudent = async (studentId: string) => {
  const now = new Date();

  // Upcoming bookings
  const upcoming = await prisma.booking.findMany({
    where: {
      studentId,
      date: { gte: now },
      status: "CONFIRMED"
    },
    include: {
      tutor: {
        include: {
          user: { select: { name: true, image: true } }
        }
      }
    },
    orderBy: { date: "asc" }
  });

  // Past bookings
  const past = await prisma.booking.findMany({
    where: {
      studentId,
      OR: [
        { date: { lt: now } },
        { status: "COMPLETED" }
      ]
    },
    include: {
      tutor: {
        include: {
          user: { select: { name: true, image: true } }
        }
      }
    },
    orderBy: { date: "desc" }
  });

  return { upcoming, past };
};











 const createBooking = async (data:Booking) => {
  const results =  prisma.booking.create({
    data: {
      date: new Date(data.date),
      time: data.time,
      tutorId: data.tutorId,
      studentId: data.studentId,
    },
    include: {
      tutor: {
        select: { id: true, rating: true }
      },
      student: {
        select: { name: true, email: true }
      }
    }
  });
  return results
};


export const bookingService = {
    getAllBookingsForStudent,
    createBooking
}