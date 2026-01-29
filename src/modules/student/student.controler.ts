import { NextFunction, Request, Response } from "express"
import { studentService } from "./student.service";



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




export const studentControler = {
   getProfile,
    updateProfile,
   
}