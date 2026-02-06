import express from "express";
import { authController } from "./authentication.controler";

const router = express.Router();

// POST /auth/register
router.post("/register", authController.register);

export const authenticationRouter = router