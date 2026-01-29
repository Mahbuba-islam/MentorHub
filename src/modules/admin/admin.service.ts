
import { prisma } from "../../lib/prisma";


 const getAllUsers = async () => {
 
    return prisma.user.findMany({
      include: {
        tutorProfile: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }




  // ban unban

   const manageUser = async (userId: string, status: "ACTIVE" | "BANNED") => {
   return prisma.user.update({
      where: { id: userId },
      data: { status }
    });
  }


  // view all bookings
  // src/modules/admin/admin.service.ts

 const viewAllBookings = async()=> {
  return prisma.booking.findMany({
      include: {
        tutor: {
          include: {
            user: true
          }
        },
       
      },
      orderBy: {
        date: "desc"
      }
    });
  }




  //manage categories
  // src/modules/admin/admin.service.ts


  // Create category
  const createCategory = async(name: string)=> {
    return prisma.category.create({
      data: { name }
    });
  }

  // Update category
   const updateCategory = async(id: string, name: string) =>{
    return prisma.category.update({
      where: { id },
      data: { name }
    });
  }

  // Delete category
   const deleteCategory = async(id: string)=> {
    return prisma.category.delete({
      where: { id }
    });
  }

  


  export const adminService = {
   getAllUsers,
   manageUser,
   viewAllBookings,
   createCategory,
   updateCategory,
   deleteCategory,
   
}
