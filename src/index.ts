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

// ⭐ Allowed origins (env-driven so Render can override)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  "https://mentor-hub-client.vercel.app",
  "http://localhost:3000",
].filter((u): u is string => Boolean(u));

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin / server-to-server (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

// ⭐ GLOBAL CORS (must be FIRST, and must handle preflight)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ⭐ Trust the proxy (Render / Vercel) so req.protocol === "https"
// and Set-Cookie Secure works correctly behind the load balancer.
app.set("trust proxy", 1);

// ⭐ Better Auth's CSRF/origin guard rejects requests without an `Origin`
// header ("Missing or null Origin"). When the Next.js frontend calls us
// from a Server Action / Route Handler, the browser Origin is NOT
// forwarded (it's a server-to-server fetch). We synthesize one here so
// Better Auth's check has something to compare against `trustedOrigins`.
// CORS above still restricts which BROWSER origins can reach us.
app.use("/api/auth", (req, _res, next) => {
  if (!req.headers.origin) {
    const synthesized =
      process.env.FRONTEND_URL ||
      process.env.CORS_ORIGIN ||
      "https://mentor-hub-client.vercel.app";
    req.headers.origin = synthesized;
  }
  next();
});

// ⭐ BetterAuth handler — MUST be mounted BEFORE express.json()
// because Better Auth reads the raw request stream itself.
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON parser (after the auth handler)
app.use(express.json());

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