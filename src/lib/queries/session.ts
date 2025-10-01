import authClient from "@/lib/auth-client";
import {
  QueryClient,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { Session, User } from "better-auth/types";
import { auth } from "../auth";

export interface SessionData {
  user: User;
  session: Session;
}

export const sessionQueryKey = ["auth", "session"] as const;

export const getSession = createServerFn({ method: "GET" }).handler(
  async (): Promise<SessionData | null> => {
    const response = await auth.api.getSession({ headers: getWebRequest().headers });
    if (!response?.session || !response?.user) {
      return null;
    }
    return {
      user: response.user,
      session: response.session,
    };
  },
);

export function sessionQueryOptions() {
  return queryOptions<SessionData | null>({
    queryKey: sessionQueryKey,
    queryFn: getSession,
    // DESIGN: Session freshness strategy
    // Sessions stay fresh for 30s to minimize server calls while ensuring
    // reasonably up-to-date auth state. This balances performance vs freshness.
    staleTime: 30_000,

    // DESIGN: Cache retention for 5 minutes
    // Keeps session in memory even when components unmount, preventing
    // unnecessary re-fetches during navigation. Must be >= staleTime.
    gcTime: 5 * 60_000,

    // DESIGN: Auto-refresh on tab focus
    // Critical for multi-tab scenarios - ensures session is fresh when
    // user returns to the app. Replaces need for timer-based refresh.
    refetchOnWindowFocus: true,

    // DESIGN: Network recovery strategy
    // Always refetch after network issues to sync with server state.
    // Better Auth maintains server-side sessions, client must stay in sync.
    refetchOnReconnect: "always",
    // Retry strategy: 3 attempts for network errors, skip auth errors
    retry(failureCount, error) {
      // Don't retry auth errors - user must re-authenticate
      // Better Auth errors have a status property on the error object
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useSessionQuery() {
  return useQuery(sessionQueryOptions());
}

export function useSuspenseSessionQuery() {
  return useSuspenseQuery(sessionQueryOptions());
}

export async function prefetchSession(queryClient: QueryClient) {
  return queryClient.prefetchQuery(sessionQueryOptions());
}

export async function invalidateSession(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: sessionQueryKey });
}

export async function signOut(
  queryClient: QueryClient,
  options?: { redirect?: boolean },
) {
  await authClient.signOut();
  await queryClient.invalidateQueries({ queryKey: ["auth"] });

  if (options?.redirect !== false) {
    window.location.href = "/login";
  }
}
