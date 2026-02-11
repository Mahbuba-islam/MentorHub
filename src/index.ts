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

// ⭐ GLOBAL CORS (must be FIRST)
app.use(
  cors({
    origin: [
      "https://mentor-hub-client.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ❌ REMOVE THIS — THIS WAS BREAKING EVERYTHING
// app.options("*", ...);

// JSON parser
app.use(express.json());

// ⭐ BetterAuth-specific CORS
app.use(
  "/api/auth",
  cors({
    origin: [
      "https://mentor-hub-client.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ⭐ BetterAuth handler
app.all("/api/auth/*", toNodeHandler(auth));

// Other routes
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

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;

// app.all("/api/auth/*splat", toNodeHandler(auth));