import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

import { tutorRouter } from "./modules/tutors/tutors.router";
import { studentsRouter } from "./modules/student/student.router";
import { adminRouter } from "./modules/admin/admin.router";
import { categoryRouter } from "./modules/category/category.router";
import { bookingRouter } from "./modules/booking/booking.router";
import { reviewRouter } from "./modules/review/review.router";
import { authenticationRouter } from "./modules/authimtecation/authentication.router";

import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";

const app = express();

// ⭐ 1) GLOBAL CORS — MUST BE FIRST
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mentor-hub-client.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// ⭐ 2) Preflight
app.options("*", cors());

// ⭐ 3) JSON parser
app.use(express.json());

// ⭐ 4) BetterAuth needs its OWN CORS (VERY IMPORTANT)
app.use(
  "/api/auth",
  cors({
    origin: [
      "http://localhost:3000",
      "https://mentor-hub-client.vercel.app",
    ],
    credentials: true,
  })
);

// ⭐ 5) BetterAuth handler
app.use("/api/auth/*splat", toNodeHandler(auth));

// ⭐ 6) Other routes
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/tutors", tutorRouter);
app.use("/reviews", reviewRouter);
app.use("/categories", categoryRouter);
app.use("/bookings", bookingRouter);
app.use("/student", studentsRouter);
app.use("/auth", authenticationRouter);
app.use("/admin", adminRouter);

// ⭐ 7) Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;


// app.all("/api/auth/*splat", toNodeHandler(auth));
