import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { tutorRouter } from "./modules/tutors/tutors.router"
import { errorHandler } from "./middlewares/errorHandler"
import { notFound } from "./middlewares/notFound"
import cors from 'cors'
import { reviewRouter } from "./modules/review/router.review"
import { studentsRouter } from "./modules/student/student.router"
import { adminRouter } from "./modules/admin/admin.router"
import { categoryRouter } from "./modules/category/category.router"
import { bookingRouter } from "./modules/booking/booking.router"

const app = express()

app.use(cors({
    origin:process.env.APP_URL || "http://localhost:3000",
    credentials:true

}))


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json())





app.get("/", (req, res)=> {
    res.send("hello world")
})

app.use("/tutors", tutorRouter)
app.use("/review", reviewRouter)
app.use('/categories', categoryRouter)
app.use("/bookings", bookingRouter)
app.use("/student/profile", studentsRouter)
app.use("/admin", adminRouter)
app.use(notFound)
app.use(errorHandler)


export default app;