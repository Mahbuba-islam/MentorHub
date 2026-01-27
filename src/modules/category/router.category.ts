import { Router } from "express";

import { CategoryControler } from "./controler.category";

const router = Router()

router.post("/", CategoryControler.createCategory)

export const categoryRouter = router