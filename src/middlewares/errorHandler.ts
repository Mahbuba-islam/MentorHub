import {Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime/client";

export const errorHandler = (
    err:any,
    req:Request,
    res:Response,
    next:NextFunction
) => {
   let statusCode = 500;
   let errorMessage = "Internal server Error"
   let errDetails = err

   //prisma unique constraint
   //prisma client validation error
   if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields"
   
   }


   //PrismaClientKnownRequestError

   else if(err instanceof Prisma.PrismaClientKnownRequestError){
    
     if(err.code === "P2002"){
        statusCode = 400;
        errorMessage = "Duplicate Entry"
    }

    if(err.code === "P2003"){
           statusCode = 400;
        errorMessage = "Invalid foreign key"
       
    }
 
    if (err.code === "P2025") {
        statusCode = 400
        errorMessage = "Record not found" ;
}

   }


   // prismaClientUnknownRequestError

   else if(err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode = 500;
    errorMessage = "Error occured during query execution"
   }

    //PrismaClientInitializationError

   else if(err instanceof PrismaClientInitializationError){
    if(err.errorCode === "P1000"){
     statusCode = 400
    errorMessage = "Authentication failed"
    }

    else if(err.errorCode === "P1001")
    statusCode = 503; 
   errorMessage = "Failed to connect to the database. Please try again later.";

   }



   return res.status(statusCode).json({
    message:errorMessage,
    error:errDetails
   })
}