import { NextFunction, Request, Response } from "express"
import { bookingService, studentService } from "./student.service";



 const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
     if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const profile = await studentService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};



const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, image, bio, phone } = req.body;
 if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const updated = await studentService.updateProfile(req.user.id, {
      name,
      email,
      image,
      bio,
      phone
    });

    res.json({
      message: "Profile updated successfully",
      profile: updated
    });
  } catch (err) {
    next(err);
  }
};


 
const getUpcomingBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const studentId = req.user.id;
 
    const bookings = await studentService.upComingBookings(studentId)

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};


const getPastBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
     if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const studentId = req.user.id;

    const bookings = await studentService.getPastBookings(studentId)

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};



const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id; // ⭐ always delete logged-in user

    console.log("hit delete account", userId);

    const result = await studentService.deleteAccount(userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error: any) {
  console.error("Delete account error:", error);

  return res.status(500).json({
    success: false,
    message: error?.message || "Internal server error",
  });
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
     deleteAccount
   
}