import { env } from "@/env/client";
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: env.VITE_BASE_URL,
  plugins: [
    organizationClient({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 10,
      creatorRole: "admin",
      teams: {
        enabled: true,
      },
    }),
  ],
});

export default authClient;

export const { signIn, signOut, signUp } = authClient;
