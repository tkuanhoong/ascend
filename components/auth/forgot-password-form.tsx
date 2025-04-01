"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ForgotPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CommonInput } from "@/components/form/common-input";
import { LogIn } from "lucide-react";
import Link from "next/link";
import CardWrapper from "@/components/form/card-wrapper";
import { FormSuccessMessage } from "@/components/form/form-success-message";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { useState, useTransition } from "react";
import apiClient from "@/lib/axios";

export function ForgotPasswordForm({
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
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  //  Define a submit handler.
  async function onSubmit(values: z.infer<typeof ForgotPasswordSchema>) {
    reset();
    startTransition(async () => {
      await apiClient
        .post("/api/auth/forgot-password", values)
        .then((res) => {
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
        headerLabel="Forgot password"
        headerDescription="Enter your email to receive password reset email"
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
                {(success || error) && (
                  <div className="mt-4">
                    {success && <FormSuccessMessage message={success} />}
                    {error && <FormErrorMessage message={error} />}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full md:max-w-sm"
                  disabled={isPending}
                >
                  Send password reset email
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:max-w-sm"
                  asChild
                >
                  <Link href="/auth/login">
                    <LogIn />
                    Back to login
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
