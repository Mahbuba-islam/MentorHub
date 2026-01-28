import { Router } from "express";

import { reviewControler } from "./controler.review";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()

router.post("/", auth(userRole.USER), reviewControler.createReview);

export const reviewRouter = router