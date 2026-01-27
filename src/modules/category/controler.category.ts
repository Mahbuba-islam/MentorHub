import { NextFunction, Request, Response } from "express"

import { categoryService } from "./service.category";


const createCategory = async(req:Request, res:Response, next:NextFunction)=>{
 try{
    console.log(req.body);
   const results = await categoryService.createCategory(req.body)
   res.status(201).json(results)
 }
 catch (error) {
   next(error)
  }

}

export const CategoryControler = {
    createCategory
}