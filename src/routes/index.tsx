import { Navbar1 } from "@/components/navbar1";
import { AuthUIContext } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { use } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { hooks } = use(AuthUIContext);
  const { data: session } = hooks.useSession();

  console.log(session);
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-7xl">
        <Navbar1
          auth={{
            login: { title: "Login", url: "/auth/login" },
            signup: { title: "Sign up", url: "/auth/signup" },
          }}
        />
      </div>
    </div>
  );
}
