import { Router } from "express";

import { bookingControler } from "./booking.controler";
import auth from "../../middlewares/auth";

const router = Router()


router.post("/", auth(),  bookingControler.createBooking)
router.get("/",  auth(), bookingControler.getAllBookings)
router.delete("/:id",  auth(), bookingControler.deleteBooking)

export const bookingRouter = router