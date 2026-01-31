import { Router } from "express";


import auth, { userRole } from "../../middlewares/auth";
import { adminControler } from "./admin.controler";

const router = Router()



router.get("/getAllUsers", auth(userRole.ADMIN), adminControler.getAllUsersController)
router.patch("/users/:id/status", adminControler.manageUsers);
router.get("/bookings", auth(userRole.ADMIN), adminControler.getAllBookings);

router.post("/categories", auth(userRole.ADMIN), adminControler.createCategory);
router.put("/categories/:id",  adminControler.updateCategory);
router.delete("/categories/:id",  adminControler.deleteCategory);



export const adminRouter = router