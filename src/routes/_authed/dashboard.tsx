import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/(authenticated)/dashboard"!
      <Link to="/">HOME</Link>
    </div>
  );
}
