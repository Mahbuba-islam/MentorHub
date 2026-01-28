import { Router } from "express";

import { reviewControler } from "./controler.review";

const router = Router()

router.post("/", reviewControler.createReview)

export const reviewRouter = router