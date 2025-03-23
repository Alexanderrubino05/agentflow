"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/packages/trpc/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const formSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must contain 8 characters",
    }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const inputs: {
  name: keyof z.infer<typeof formSchema>;
  placeholder: string;
  type?: string;
}[] = [
  { name: "name", placeholder: "Full name" },
  { name: "password", placeholder: "Password", type: "password" },
  {
    name: "confirmPassword",
    placeholder: "Confirm password",
    type: "password",
  },
];

const SignupPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const signUp = api.user.signup.useMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Handle signUp
    const userResult = await signUp.mutateAsync({
      ...values,
    });

    if (userResult === "USER_ALREADY_EXISTS") {
      toast.error("This user has already been created", {
        action: (
          <Link
            href="/login"
            className="underline text-secondary-foreground transition-opacity hover:opacity-50"
          >
            Login
          </Link>
        ),
      });
    } else {
      await signIn("credentials", {
        email: values.email,
        password: values.password,
      });
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-[400px]">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-6 flex flex-col w-full items-center"
            >
              <CardTitle>Create an account</CardTitle>

              <div className="flex flex-col gap-3 w-full">
                <FormField
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          className="text-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {inputs.map((input) => (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={input.placeholder}
                            type={input.type}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="p-4 flex flex-col items-center">
                <Button isLoading={signUp.isPending} type="submit">
                  Sign up
                </Button>

                <span className="text-xs mt-4">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="underline text-secondary-foreground transition-opacity hover:opacity-50"
                  >
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
