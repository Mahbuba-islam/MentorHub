import express from "express"
import { toNodeHandler } from "better-auth/node"
import { auth } from "./lib/auth"
import { tutorRouter } from "./modules/tutors/tutors.router"
import { categoryRouter } from "./modules/category/router.category"
import { errorHandler } from "./middlewares/errorHandler"
import { notFound } from "./middlewares/notFound"

const app = express()

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json())





app.get("/", (req, res)=> {
    res.send("hello world")
})

app.use("/tutors", tutorRouter)
app.use("/category", categoryRouter)

app.use(notFound)
app.use(errorHandler)


export default app;