import { Router } from "express";
import { tutorControler } from "./tutors.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.get("/", tutorControler.getTutors)
router.get("/dashboard", auth(userRole.TUTOR, userRole.ADMIN), tutorControler.getTutorDashboard);

router.get("/featured", tutorControler.getFeaturedTutors);

router.get("/:id", tutorControler.getTutorDetails);

router.post("/", auth(), tutorControler.createTutors)
router.put("/availability", auth(), tutorControler.updateAvailability)
router.get("/bookings",auth(userRole.TUTOR, userRole.ADMIN),tutorControler.getTutorSessions)



router.put("/profile", auth(), tutorControler.updateProfile)

export const tutorRouter = router