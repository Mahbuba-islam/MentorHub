import { Router } from "express";

;
import auth, { userRole } from "../../middlewares/auth";
import { reviewController } from "./review.controler";

const router = Router()

router.post("/", auth(userRole.USER), reviewController.createReview);

export const reviewRouter = router