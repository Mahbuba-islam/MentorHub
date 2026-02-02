import { NextFunction, Request, Response } from "express"
import { bookingService } from "./booking.service";
import { userRole } from "../../middlewares/auth";


//get booking with upcoming and past
const getAllBookings = async (req:Request, res:Response, next:NextFunction) => {
  try {
    // user chack
     if(!req.user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }


    // if (req.user.role !== userRole.USER) {
    //   return res.status(403).json({ message: "Only students can view bookings" });
    // }


    const bookings = await bookingService.getAllBookingsForStudent();

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};





const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "Unauthorized" });
    }
console.log('id......',req.user.id);
    if (req.user.role !== userRole.USER) {
      return res.status(400).json({
        success: false,
        message: "Only students can book tutoring sessions",
      });
    }

    const booking = await bookingService.createBooking(req.body, req.user.id);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};


export const bookingControler = {
  getAllBookings,
    createBooking
}