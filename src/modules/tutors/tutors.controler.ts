import { NextFunction, Request, Response } from "express"
import { tutorsService } from "./tutors.service"




const getTutors = async(req:Request, res:Response, next:NextFunction)=>{
 try{
  const results = await tutorsService.getTutors()
   res.status(201).json(results)
 }
 catch (error) {
    next(error)
  }

}


const createTutors = async(req:Request, res:Response, next:NextFunction)=>{
 try{
  console.log(req.user);
    console.log(req.body);
    const user = req.user

    if(!user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }

   const results = await tutorsService.createTutors(req.body, user.id )
   res.status(201).json(results)
 }
 catch (error) {
    next(error)
  }

}

export const tutorControler = {
    getTutors,
    createTutors
}