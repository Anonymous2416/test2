import { ThemeProvider } from "@/components/ThemeProvider";
import authClient from "@/lib/auth-client";
import { Providers } from "@/lib/providers";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: typeof authClient;
}>()({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IAMS" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="light">
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
