import { Router } from "express";
import { tutorControler } from "./tutors.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.get("/", tutorControler.getTutors)

router.post("/", auth(userRole.TUTOR), tutorControler.createTutors)

export const tutorRouter = router