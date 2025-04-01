"use client";
import { CommonInput } from "@/components/form/common-input";
import { FormErrorMessage } from "@/components/form/form-error-message";
import { FormSuccessMessage } from "@/components/form/form-success-message";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import apiClient from "@/lib/axios";
import { ChangePasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ChangePasswordForm = () => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      current: "",
      password: "",
      confirmPassword: "",
    },
  });

  const reset = () => {
    setSuccess("");
    setError("");
  };

  async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
    reset();
    startTransition(async () => {
      // Call change password api
      await apiClient
        .patch("/api/auth/change-password", values)
        .then((res) => {
          setSuccess(res.data.success);
          // Reset the form upon successful response
          form.reset();
        })
        .catch((error) => {
          setError(error.response.data.error);
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <CommonInput
          control={form.control}
          name="current"
          label="Current password"
          disabled={isPending}
          type="password"
          placeholder="Enter current password..."
        />
        <CommonInput
          control={form.control}
          name="password"
          label="New password"
          disabled={isPending}
          type="password"
          placeholder="Enter new password..."
        />
        <CommonInput
          control={form.control}
          name="confirmPassword"
          label="Confirm new password"
          disabled={isPending}
          type="password"
          placeholder="Confirm new password..."
        />
        {(success || error) && (
          <div className="mt-4">
            {success && <FormSuccessMessage message={success} />}
            {error && <FormErrorMessage message={error} />}
          </div>
        )}
        <Button type="submit" disabled={isPending}>
          Save password
        </Button>
      </form>
    </Form>
  );
};
