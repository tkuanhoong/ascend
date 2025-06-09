"use client";

import { CommonInput } from "@/components/form/common-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from ".prisma/client";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { ResetPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditUserPasswordFormProps {
  initialData: User;
}

type EditUserPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export default function EditUserPasswordForm({
  initialData,
}: EditUserPasswordFormProps) {
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: EditUserPasswordFormData) => {
    try {
      await apiClient.patch(
        `/api/admin/users/${initialData.id}/update-password`,
        values
      );
      successToast({ message: "User password updated" });
      form.reset();
    } catch (error) {
      console.log(error);
      unexpectedErrorToast();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <CommonInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="Enter Password..."
          disabled={isSubmitting}
        />
        <CommonInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Enter Confirm Password..."
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting} className="md:ml-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
}
