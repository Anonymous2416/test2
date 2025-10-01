import { AuthView } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/$authView")({
  component: RouteComponent,
});

function RouteComponent() {
  const { authView } = Route.useParams();

  return (
    <main className="container flex h-screen flex-col items-center justify-center">
      <AuthView
        pathname={authView}
        redirectTo="/"
        classNames={{
          footerLink: "cursor-pointer",
          form: {
            button: "cursor-pointer",
          },
        }}
      />
    </main>
  );
}
