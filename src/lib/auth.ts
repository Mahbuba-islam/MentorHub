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

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  cors: {
    origin: [
      "https://mentor-hub-client.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },


   trustedOrigins: [],


  // ⭐ FIX — Server Actions NEVER send Origin → disable CSRF
  csrf: false,

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
        secure: true,
        sameSite: "none",
        path: "/",
      },
    },
  },
});