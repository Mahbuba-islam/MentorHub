import { prisma } from "../../lib/prisma";

 const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
     role: true
    }
  });
};





const updateProfile = async (
  userId: string,
  data: { name?: string; email?: string; image?: string; bio?: string }
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.image && { image: data.image }),
      ...(data.bio && { bio: data.bio })
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
     
    }
  });
};

export const studentService = {
  getProfile,
 updateProfile
}