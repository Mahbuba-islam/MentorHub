import { Router } from "express";

import { bookingControler } from "./controler.booking";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()


router.post("/", auth(userRole.USER), bookingControler.createBooking)
router.get("/", auth(userRole.USER), bookingControler.createBooking)

export const bookingRouter = router