import { Router } from "express";
import { postControler } from "./post.controler";

const router = Router()

router.post("/", postControler.createPost)

export const postRouter = router