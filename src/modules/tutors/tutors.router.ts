import { Router } from "express";
import { tutorControler } from "./tutors.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.get("/", tutorControler.getTutors)
router.get("/sessions", auth(),tutorControler.getTutorSessions)


router.get("/availability", auth(), tutorControler.getAvailability)
router.get("/dashboard", auth(userRole.TUTOR, userRole.ADMIN), tutorControler.getTutorDashboard);

router.get("/featured", tutorControler.getFeaturedTutors);

router.get("/:id", tutorControler.getTutorDetails);

router.post("/", auth(), tutorControler.createTutors)
router.post("/availability", auth(), tutorControler.updateAvailability)



router.put("/profile", auth(), tutorControler.updateProfile)

export const tutorRouter = router