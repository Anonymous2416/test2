import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { sessionQueryKey } from "@/lib/queries/session";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

type SignupSchema = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/auth/signup2")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: async (data: SignupSchema) => {
      return await signUp.email({ ...data, callbackURL: "/" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      // navigate({ to: "/" });
    },
    onError: (error: Error) => {
      toast.error("Sign up failed", {
        description: error.message,
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    console.log("handleSubmit");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log(name, email, password, confirmPassword);
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    console.log("handleSubmit3");

    signupMutate({
      name,
      email,
      password,
    });
  }

  return (
    <div className="flex items-center justify-center">
      <form
        className="flex h-screen w-full max-w-md flex-col items-center justify-center gap-4"
        onSubmit={handleSubmit}
      >
        <Input type="text" placeholder="Name" name="name" />
        <Input type="email" placeholder="Email" name="email" />
        <Input type="password" placeholder="Password" name="password" />
        <Input type="password" placeholder="Confirm Password" name="confirmPassword" />
        <Button className="w-full" type="submit" disabled={isPending}>
          Sign up
        </Button>
      </form>
    </div>
  );
}
