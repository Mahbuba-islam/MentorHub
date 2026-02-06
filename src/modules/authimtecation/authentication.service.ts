import { prisma } from "../../lib/prisma";

export const authService = {
  async updateUserRole({ userId, name, email, role } : { userId:string, name:string, email:string, role:string}) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role, 
      },
    });
  },
};
