import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import authClient from "@/lib/auth-client";
import { queryClient } from "@/lib/query";
import { TanstackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryProvider>
        <AuthUIProviderTanstack
          authClient={authClient}
          persistClient={false}
          navigate={(href) => router.navigate({ href })}
          replace={(href) => router.navigate({ href, replace: true })}
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          {children}
        </AuthUIProviderTanstack>
        <Toaster richColors />
        <TanstackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
      </AuthQueryProvider>
    </QueryClientProvider>
  );
}
