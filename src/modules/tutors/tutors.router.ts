import { Router } from "express";
import { tutorControler } from "./tutors.controler";

const router = Router()

router.post("/", tutorControler.createTutors)

export const tutorRouter = router