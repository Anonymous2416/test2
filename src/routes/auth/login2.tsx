import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/queries/session";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/auth/login2")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.fetchQuery(sessionQueryOptions());

    if (session?.user && session?.session) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: async (data: LoginSchema) => {
      return await signIn.email({ ...data, callbackURL: "/" });
    },
    onSuccess: () => {},
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) return;
    loginMutate({ email, password });
  }
  return (
    <div className="flex items-center justify-center">
      <form
        className="flex h-screen w-full max-w-md flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <Input type="email" placeholder="Email" name="email" />
        <Input type="password" placeholder="Password" name="password" />
        <Button className="w-full" type="submit" disabled={isPending}>
          Login
        </Button>
      </form>
    </div>
  );
}
