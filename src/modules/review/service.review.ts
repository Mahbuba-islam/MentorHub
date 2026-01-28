
import { prisma } from "../../lib/prisma";

export const createReview = async (studentId: string, data: any) => {
  const { bookingId, rating, comment } = data;

  // 1. Validate booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true }
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.studentId !== studentId) throw new Error("Unauthorized");
  if (booking.status !== "COMPLETED") throw new Error("Session not completed");

  // 2. Check duplicate review
  const existing = await prisma.review.findFirst({
    where: {
      studentId,
      tutorId: booking.tutorId
    }
  });

  if (existing) throw new Error("Review already submitted");

  // 3. Create review
  const review = await prisma.review.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      rating,
      comment
    }
  });

  // 4. Update tutor rating
  const stats = await prisma.review.aggregate({
    where: { tutorId: booking.tutorId },
    _avg: { rating: true },
    _count: { rating: true }
  });

  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: {
      rating: stats._avg.rating,
      totalReviews: stats._count.rating
    }
  });

  return review;
};




export const reviewService  = {
    createReview
}