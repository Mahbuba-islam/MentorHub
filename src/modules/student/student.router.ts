import { Router } from "express";
import { studentControler } from "./student.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.get("/", auth(userRole.USER), studentControler.getProfile)

router.put("/", auth(userRole.USER), studentControler.updateProfile)

export const studentRouter = router