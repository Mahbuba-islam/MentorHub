import { NextFunction, Request, Response } from "express"
import { tutorsService } from "./tutors.service"



// get all tutors
const getTutors = async(req:Request, res:Response, next:NextFunction)=>{
 try{
  const {search} = req.query
  const categoryName = req.query.category 
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
    const tutors = await tutorsService.findFeaturedTutors();
    res.status(200).json({ success: true, data: tutors });
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


//updateAvailability

const updateAvailability = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { date, timeSlots } = req.body;

    const result = await tutorsService.updateAvailability(req.user.id, {
      date,
      timeSlots,
    });

    res.json({
      message: "Availability updated successfully",
      availability: result,
    });
  } catch (err) {
    next(err);
  }
};






//create tutors

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






//update
 const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { bio, price, subject, categoryId } = req.body;

    const updatedProfile = await tutorsService.updateTutorProfile(req.user.id, {
      bio,
      price,
      subject,     // string[]
      categoryId,  // single category
    });

    res.json({
      message: "Tutor profile updated successfully",
      profile: updatedProfile,
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
    updateAvailability
}