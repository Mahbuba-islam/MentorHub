import { NextFunction, Request, Response } from "express"
import { bookingService, studentService } from "./student.service";
import { prisma } from "../../lib/prisma";



 const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const profile = await studentService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};



const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, email, image, bio } = req.body;

    const updated = await studentService.updateProfile(req.user.id, {
      name,
      email,
      image,
      bio
    });

    res.json({
      message: "Profile updated successfully",
      profile: updated
    });
  } catch (err) {
    next(err);
  }
};


 
const getUpcomingBookings = async (req: any, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user.id;

    const bookings = await studentService.upComingBookings(studentId)

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};


const getPastBookings = async (req: any, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user.id;

    const bookings = await studentService.getPastBookings(studentId)

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};


// bookings status changed


const markCompleted = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookingId = req.params.id;
    const studentId = req.user.id;

    const updated = await bookingService.markCompleted(bookingId as string, studentId);

    return res.json({
      success: true,
      message: "Booking marked as completed",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to complete booking",
    });
  }
};





export const studentControler = {
   getProfile,
    updateProfile,
    getPastBookings,
    getUpcomingBookings,
     markCompleted,
   
}