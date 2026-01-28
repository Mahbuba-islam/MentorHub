import { Router } from "express";
import { tutorControler } from "./tutors.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.get("/", tutorControler.getTutors)
router.get("/dashboard", auth(userRole.TUTOR), tutorControler.getTutorDashboard);

router.get("/featured", tutorControler.getFeaturedTutors);

router.get("/:id", tutorControler.getTutorDetails);

router.post("/", auth(), tutorControler.createTutors)

export const tutorRouter = router