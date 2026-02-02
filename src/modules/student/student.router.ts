import { Router } from "express";
import { studentControler } from "./student.controler";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.get("/profile", auth(userRole.USER), studentControler.getProfile)
router.get("/bookings/upcoming", auth(userRole.USER), studentControler.getUpcomingBookings)
router.get("/bookings/past", auth(userRole.USER), studentControler.getPastBookings)
router.put(
  "/bookings/:id/complete",
  auth(userRole.USER),
  studentControler.markCompleted
);

router.put("/update-profile", auth(userRole.USER), studentControler.updateProfile)

export const studentsRouter = router