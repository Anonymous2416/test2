import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    // const { hooks } = useContext(AuthUIContext);
    // const { data: session } = hooks.useSession();
    // if (!session?.user || !session?.session) {
    //   throw redirect({
    //     to: "/auth/login2",
    //     search: {
    //       redirect: location.href,
    //     },
    //   });
    // }
    // return { user: session.user, session: session };
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/_authed"!
      <Outlet />
    </div>
  );
}
