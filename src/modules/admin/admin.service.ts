import { prisma } from "../../lib/prisma"

// -----------------------------
// 1) View All Users
// -----------------------------

 const getAllUsersService = async () => {
  return prisma.user.findMany({
    include: {
      tutorProfile: true,
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

// -----------------------------
// 2) Ban / Unban User
// -----------------------------
const manageUser = async (userId: string, status: "ACTIVE" | "BANNED") => {
  return prisma.user.update({
    where: { id: userId },
    data: { status }
  })
}

// -----------------------------
// 3) View All Bookings
// -----------------------------
const viewAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      tutor: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
     
    },
    orderBy: { date: "desc" }
  })
}

// -----------------------------
// 4) Create Category
// -----------------------------
const createCategory = async (name: string) => {
  return prisma.category.create({
    data: { name }
  })
}

// -----------------------------
// 5) Update Category
// -----------------------------
const updateCategory = async (id: string, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name }
  })
}

// -----------------------------
// 6) Delete Category
// -----------------------------
const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id }
  })
}

export const adminService = {
  getAllUsersService,
  manageUser,
  viewAllBookings,
  createCategory,
  updateCategory,
  deleteCategory
}