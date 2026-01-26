import { Request, Response } from "express"
import { postServices } from "./post.service"


const createPost = async(req:Request, res:Response)=>{
 try{
    
   const results = await postServices.createPost(req.body)
   res.status(201).json(results)
 }
 catch(e){
  res.status(400).json({
    error:"post creation failed",
    details:e
  })
 }
}

export const postControler = {
    createPost
}