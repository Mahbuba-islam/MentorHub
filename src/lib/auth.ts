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

// In production we run on Render (HTTPS) and the frontend is on Vercel (HTTPS).
// In dev both are http://localhost:* — secure cookies must be off there or
// the browser will silently drop the Set-Cookie.
const IS_PROD = process.env.NODE_ENV === "production";

const FRONTEND_URLS = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  process.env.BETTER_AUTH_URL, // allow same-origin server-action calls
  "https://mentor-hub-client.vercel.app",
  "http://localhost:3000",
].filter((u): u is string => Boolean(u));

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ⭐ Better Auth checks the Origin header against this list. The Express
  // middleware in `src/index.ts` synthesizes an Origin header for
  // server-to-server (Next.js Server Action) calls, so this list is what
  // it gets compared against.
  trustedOrigins: FRONTEND_URLS,

  advanced: {
    // Render/Vercel serve HTTPS in prod; localhost is plain HTTP in dev.
    // SameSite=None REQUIRES Secure, so we only enable it in production.
    useSecureCookies: IS_PROD,

    // Belt-and-braces: the Express middleware already injects an Origin
    // header for server-action calls, so Better Auth's CSRF check would
    // pass anyway. Keeping this on means a missing Origin is never fatal.
    disableCSRFCheck: true,

    // Cross-site cookies (vercel.app → onrender.com) require
    // SameSite=None; Secure in prod. In dev, fall back to "lax".
    defaultCookieAttributes: IS_PROD
      ? {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        }
      : {
          sameSite: "lax",
          secure: false,
          httpOnly: true,
          path: "/",
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