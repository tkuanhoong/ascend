import { cn } from "@/lib/utils";
import { ResetPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "../form/card-wrapper";
import { CommonInput } from "../form/common-input";
import { FormErrorMessage } from "../form/form-error-message";
import { FormSuccessMessage } from "../form/form-success-message";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import apiClient from "@/lib/axios";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const token = searchParams.get("token");

  const reset = () => {
    setError("");
    setSuccess("");
  };

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  //  Define a submit handler.
  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    reset();
    startTransition(async () => {
      await apiClient
        .post("/api/auth/reset-password", { ...values, token })
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
        headerLabel="Reset your password"
        headerDescription="New password for your account"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4"></div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <CommonInput
                    control={form.control}
                    name="password"
                    label="New Password"
                    placeholder="Your new password..."
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
                {(success || error) && (
                  <div className="mt-4">
                    {success && <FormSuccessMessage message={success} />}
                    {error && <FormErrorMessage message={error} />}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                  Reset Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:max-w-sm"
                  asChild
                >
                  <Link href="/auth/login">
                    <LogIn />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
