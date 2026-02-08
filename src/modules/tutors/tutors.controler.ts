import { NextFunction, Request, Response } from "express"
import { tutorsService } from "./tutors.service"



// get all tutors
const getTutors = async(req:Request, res:Response, next:NextFunction)=>{
 try{
  const {search} = req.query
  const categoryName = req.query.categoryName 
  console.log(req.query);
  const searchString = typeof search === 'string' ? search  : undefined
  const categoryString = typeof categoryName === 'string' ? categoryName : undefined
  console.log('search', search);
  const results = await tutorsService.getTutors({search:searchString, categoryName:categoryString})
   res.status(201).json(results)
 }
 catch (error) {
    next(error)
  }

}





// get tutors details by id

const getTutorDetails = async(req:Request, res:Response, next:NextFunction)=> {
  try {
      const { id } = req.params;

      const tutor = await tutorsService.getTutorDetails(id as string);

      res.status(200).json({
        success: true,
        data: tutor
      });
    } catch (error) {
      next(error);
    }

}


// find featured tutor controler

 const getFeaturedTutors = async (req: Request, res: Response, next:NextFunction) => {
  try {
   
  const results = await tutorsService.findFeaturedTutors()
   res.status(201).json(results)
    
  } catch (error) {
    next(error)
  }
};



//get tutor dashboard data
const getTutorDashboard = async (req: Request, res: Response, next:NextFunction) => {
  try {

   if(!req.user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }
    const tutorId = req.user.id;
 
    const data = await tutorsService.getTutorDashboard(tutorId);

    return res.json({
      success: true,
      data
    });
  } catch (error) {
   next(error)
  }
};


 // -----------------------------
  // GET AVAILABILITY
  // -----------------------------
  const getAvailability = async (req: Request, res: Response, next:NextFunction) => {
   

    try {
       console.log("GET availability → userId:", req.user);

        if(!req.user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }
      const userId = req.user.id;

      const result = await tutorsService.getAvailability(userId);
console.log("GET availability → result:", result);

      res.json({
        success: true,
        message: "Availability fetched successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }






//updateAvailability

const updateAvailability = async (req: Request, res: Response, next:NextFunction) => {
  try {
    
    const { date, timeSlots } = req.body;
 if(!req.user){
     return res.status(400).json({
        error:"Unothorized",
      })
    }
    const result = await tutorsService.updateAvailability(req.user.id, {
      date,
      timeSlots,
    });

    res.json({
      success: true,
      message: "Availability set successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};







//create tutors


const createTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
console.log("REQ COOKIES:", req.cookies);
console.log("REQ USER:", req.user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    
    const results = await tutorsService.createTutors(req.body, user.id);
console.log('tutor profile', results);
    return res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: results,
    });

  } catch (error) {
    next(error);
  }
};



const getTutorReviews = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;
    console.log('IdDDDD',userId);
    const reviews = await tutorsService.getTutorReviews(userId);

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};



//tutor session controler
 const getTutorSessions = async(req: any, res: Response, next: NextFunction) => {
    try {
      const tutorId = req.user.id  
 console.log("GET SESSIONS → userId:", req.user?.id);


      const bookings = await tutorsService.getTutorSessions(tutorId)

      return res.json({
        success: true,
        bookings
      })
    } catch (err) {
      next(err)
    }
  }





//update
 const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { bio, price, subject, categoryId , isFeatured} = req.body;

    const updatedProfile = await tutorsService.updateTutorProfile(req.user.id, {
      bio,
      price,
      subject,     
      categoryId, 
      isFeatured
    });

   res.json({
  success: true,
  message: "Tutor profile updated successfully",
  data: updatedProfile,
});

  } catch (err) {
    next(err);
  }
};




export const tutorControler = {
    getTutors,
    getTutorDetails,
    getTutorDashboard,
    getFeaturedTutors,
    createTutors,
    updateProfile,
    updateAvailability,
    getTutorSessions,
    getAvailability,
    getTutorReviews
}

