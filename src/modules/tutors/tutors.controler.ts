import { NextFunction, Request, Response } from "express"
import { tutorsService } from "./tutors.service"


const createTutors = async(req:Request, res:Response, next:NextFunction)=>{
 try{
    console.log(req.body);
   const results = await tutorsService.createTutors(req.body)
   res.status(201).json(results)
 }
 catch (error) {
    next(error)
  }

}

export const tutorControler = {
    createTutors
}