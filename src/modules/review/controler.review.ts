import { NextFunction, Request, Response } from "express"

import { reviewService } from "./service.review";

const createReview = async(req:Request, res:Response, next:NextFunction)=>{
 try{
    const user = req.user
   if(!user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }

   const results = await reviewService.createReview(req.body, user.id)
   res.status(201).json(results)
 }
 catch (error) {
   next(error)
  }

}

export const reviewControler = {
   createReview
}