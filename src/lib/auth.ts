import { serverOnly } from "@tanstack/react-start";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

import { env } from "@/env/server";
import { db } from "@/lib/db";

const getAuthConfig = serverOnly(() =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: env.BASE_URL,
    trustedOrigins: [env.BASE_URL],
    secret: env.BETTER_AUTH_SECRET,
    telemetry: {
      enabled: false,
    },
    rateLimit: {
      enabled: true,
      max: 100,
      window: 10,
    },
    logger: {
      enabled: true,
      level: "info",
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      reactStartCookies(),
      organization({
        allowUserToCreateOrganization: true,
        organizationLimit: 5,
        membershipLimit: 10,
        creatorRole: "admin",
        teams: {
          enabled: true,
        },
      }),
    ],
  }),
);

export const auth = getAuthConfig();
