"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { RegisterSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CommonInput } from "../form/common-input";
import { Home } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { FormErrorMessage } from "../form/form-error-message";
import { FormSuccessMessage } from "../form/form-success-message";
import CardWrapper from "@/components/form/card-wrapper";
import apiClient from "@/lib/axios";

export function RegisterForm({
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

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      identityNo: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    reset();
    startTransition(async () => {
      await apiClient
        .post("/api/auth/register", values)
        .then((res) => {
          const successMessage = res.data.success;
          setSuccess(successMessage);
        })
        .catch((error) => {
          const errorMessage = error.response.data.error;
          setError(errorMessage);
        });
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardWrapper
        headerLabel="Register an account"
        headerDescription="Create your account"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-col">
              <div className="grid md:grid-cols-2 md:grid-rows-3 md:grid-flow-col gap-6">
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
                    name="identityNo"
                    label="Identification Number (without '-')"
                    placeholder="Enter IC No..."
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-2">
                  <CommonInput
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Your Full Name Per IC..."
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
                    disabled={isPending}
                  />
                </div>

                <div className="grid gap-2">
                  <CommonInput
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Your confirm password..."
                    type="password"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
            {(success || error) && (
              <div className="mt-4">
                {success && <FormSuccessMessage message={success} />}
                {error && <FormErrorMessage message={error} />}
              </div>
            )}
            <div className="grid place-items-center gap-6 mt-4">
              <Button
                type="submit"
                className="w-full md:max-w-sm"
                disabled={isPending}
              >
                Create Account
              </Button>

              <Button variant="outline" className="w-full md:max-w-sm" asChild>
                <Link href="/">
                  <Home />
                  Back to Home
                </Link>
              </Button>
              <div className="text-center text-sm md:max-w-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
