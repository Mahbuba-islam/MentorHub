// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { prisma } from "./prisma";

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),

//   // ⭐ CORS FIX (MOST IMPORTANT)
//   cors: {
//     origin: [
//       "https://mentor-hub-client.vercel.app",
//       "http://localhost:3000",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   },

//   // ⭐ CSRF protection
//   // trustedOrigins: [
//   //   "https://mentor-hub-client.vercel.app",
//   //   "http://localhost:3000",
//   // ],

//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "STUDENT",
//         required: true,
//       },
//       phone: {
//         type: "string",
//         required: false,
//       },
//       status: {
//         type: "string",
//         defaultValue: "ACTIVE",
//         required: false,
//       },
//     },
//   },

//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false,
//   },

//   cookies: {
//     sessionToken: {
//       name: "better-auth-session",
//       options: {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//         path: "/",
//       },
//     },
//   },
// });





import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const FRONTEND_URLS = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  "https://mentor-hub-client.vercel.app",
  "http://localhost:3000",
].filter((u): u is string => Boolean(u));

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ⭐ Better Auth checks the Origin header against this list.
  // Without it you get: "Missing or null Origin".
  trustedOrigins: FRONTEND_URLS,

  advanced: {
    // Cross-site cookies require SameSite=None; Secure
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      path: "/",
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },

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
});