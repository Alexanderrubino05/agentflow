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
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const inputs: {
  name: keyof z.infer<typeof formSchema>;
  placeholder: string;
}[] = [
  { name: "email", placeholder: "Email" },
  { name: "password", placeholder: "Password" },
];

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        error === "CredentialsSignin"
          ? "Invalid email or password"
          : "An error occurred"
      );
    }
  }, [searchParams]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login");
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
              <CardTitle>Login to your account</CardTitle>
              <div className="flex flex-col gap-3 w-full">
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
                            type={
                              input.name === "password" ? "password" : "text"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="pt-4 flex flex-col items-center gap-2">
                <Button isLoading={form.formState.isSubmitting} type="submit">
                  Login
                </Button>

                <span className="text-xs">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="underline text-secondary-foreground transition-opacity hover:opacity-50"
                  >
                    Sign up
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

export default LoginPage;
