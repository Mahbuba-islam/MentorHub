import { Router } from "express";
import { categoryControler } from "./category.controler";




const router = Router()

router.get("/categories",  categoryControler.getAllCategories);

export const categoryRouter = router