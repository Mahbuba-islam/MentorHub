import { Router } from "express";

import { bookingControler } from "./booking.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()


router.post("/", auth(userRole.USER), bookingControler.createBooking)
router.get("/", auth(), bookingControler.getAllBookings)

export const bookingRouter = router