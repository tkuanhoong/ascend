"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CommonInput } from "../form/common-input";
import { Home, LogIn } from "lucide-react";
import Link from "next/link";
import CardWrapper from "../form/card-wrapper";
import { FormSuccessMessage } from "../form/form-success-message";
import { FormErrorMessage } from "../form/form-error-message";
import { useState, useTransition } from "react";
import apiClient from "@/lib/axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setError("");
    setSuccess("");
  };

  // Define form
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  //  Define a submit handler.
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    reset();
    startTransition(async () => {
      await apiClient
        .post("/api/auth/login", values)
        .then((res) => {
          if (res.data.redirectUrl) {
            window.location.replace("/");
            return;
          }
          const successMessage = res.data.success;
          setSuccess(successMessage);
        })
        .catch((error) => {
          const errorMessage = error.response.data.error;
          setError(errorMessage);
        });
    });
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardWrapper
        headerLabel="Welcome back"
        headerDescription="Login to your account"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4"></div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <CommonInput
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Your email address..."
                    type="email"
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <CommonInput
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Your password..."
                    type="password"
                    href="/auth/forgot-password"
                    disabled={isPending}
                  />
                </div>
                {(success || error) && (
                  <div className="mt-4">
                    {success && <FormSuccessMessage message={success} />}
                    {error && <FormErrorMessage message={error} />}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                  <LogIn />
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:max-w-sm"
                  asChild
                >
                  <Link href="/">
                    <Home />
                    Back to Home
                  </Link>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="underline underline-offset-4"
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
