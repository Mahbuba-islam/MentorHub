import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ✅ SAFE for local + prod
 trustedOrigins: [
  "https://mentor-hub-client.vercel.app"
].filter(Boolean),



  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  cookies: {
    sessionToken: {
      name: "better-auth-session",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax",
        path: "/",
      },
    },
  },
});
