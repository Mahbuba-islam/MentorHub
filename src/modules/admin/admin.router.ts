import { Router } from "express";


import auth, { userRole } from "../../middlewares/auth";
import { adminControler } from "./admin.controler";

const router = Router()



router.get("/getAllUsers", auth(userRole.ADMIN), adminControler.getAllUsers)
router.patch("/users/:id/status", auth(userRole.ADMIN), adminControler.manageUsers);
router.get("/bookings", auth(userRole.ADMIN) , adminControler.getAllBookings);

router.post("/categories", auth(userRole.ADMIN), adminControler.createCategory);
router.put("/categories/:id", auth(userRole.ADMIN), adminControler.updateCategory);
router.delete("/categories/:id", auth(userRole.ADMIN), adminControler.deleteCategory);



export const adminRouter = router