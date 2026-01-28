import { NextFunction, Request, Response } from "express"

import { reviewService } from "./service.review";

const createReview = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const user = req.user
    if(!user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }

    const studentId = user.id;
    const review = await reviewService.createReview(studentId, req.body);

    res.json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
   next(error)
  }
};

export const reviewControler = {
   createReview
}