import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { tutorRouter } from "./modules/tutors/tutors.router"
import { errorHandler } from "./middlewares/errorHandler"
import { notFound } from "./middlewares/notFound"
import cors from 'cors'

import { studentsRouter } from "./modules/student/student.router"
import { adminRouter } from "./modules/admin/admin.router"
import { categoryRouter } from "./modules/category/category.router"
import { bookingRouter } from "./modules/booking/booking.router"
import { reviewRouter } from "./modules/review/review.router"

import { authenticationRouter } from "./modules/authimtecation/authentication.router"

const app = express()

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json())





app.get("/", (req, res)=> {
    res.send("hello world")
})

app.use("/tutors", tutorRouter)
app.use("/reviews", reviewRouter)
app.use('/categories', categoryRouter)
app.use("/bookings", bookingRouter)
app.use("/student", studentsRouter)
app.use("/auth", authenticationRouter)
app.use("/admin", adminRouter)
app.use(notFound)
app.use(errorHandler)



export default app;