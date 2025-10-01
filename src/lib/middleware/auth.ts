import { auth } from "@/lib/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const session = await auth.api.getSession({
      headers: getWebRequest().headers,
      query: {
        disableCookieCache: true,
      },
    });

    if (!session) {
      setResponseStatus(401, "Unauthorized");
      throw new Error("Unauthorized");
    }

    return next({ context: { user: session.user, session: session } });
  },
);
