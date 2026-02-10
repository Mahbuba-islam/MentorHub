// import { Request, Response, NextFunction } from "express"
// import {auth as betterAuth} from "../lib/auth"


// declare global {
//     namespace Express{
//         interface Request{
//             user?:{
//                 id: string,
//                 email:string,
//                 name:string,
//                 role:string,
//                 emailVerified:boolean
//             }
//         }
//     }
// }


// // role type
// export enum userRole {
//     USER = "STUDENT",
//     TUTOR = "TUTOR",
//     ADMIN = "ADMIN"

// }
//  const auth = (...roles:userRole[]) => {
//    return async(req:Request,res:Response,next:NextFunction)=>{
    
// try{
//      //get user session
//     const session = await betterAuth.api.getSession({
//         headers:req.headers as any
//     })
//   console.log('S',session);
//     if(!session){
//         return res.status(401).json({
//             success:false,
//             message:"you are not authorized"
//         })
//     }

   

//    req.user = {
//     id: session.user.id,
//     email:session.user.email,
//     name:session.user.name,
//     role:session.user.role,
//     emailVerified:session.user.emailVerified
//    }
      
//    if(roles.length && !roles.includes(req.user.role as userRole)){
//      return res.status(403).json({
//             success:false,
//             message:"forbidden. You don't have right to access the resources!"
//         })
//    }

//    next()
// }
// catch(e){
//  next(e)
// }

//     }

// }

// export default auth;



import { Request, Response, NextFunction } from "express";
import { auth as betterAuth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export enum userRole {
  USER = "STUDENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

const auth = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ⭐ FIX: Only send cookie header
      const session = await betterAuth.api.getSession({
        headers: {
          cookie: req.headers.cookie || "",
        },
      });

      console.log("SESSION:", session);

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "you are not authorized",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as userRole)) {
        return res.status(403).json({
          success: false,
          message: "forbidden. You don't have right to access the resources!",
        });
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};

export default auth;