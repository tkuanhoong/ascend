"use client";
import { CommonInput } from "@/components/form/common-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/prisma/app/generated/prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import apiClient from "@/lib/axios";
import { successToast } from "@/lib/toast";
import { FormErrorMessage } from "@/components/form/form-error-message";

interface ProfileAccountFormProps {
  user: User;
}

export const ProfileAccountForm = ({ user }: ProfileAccountFormProps) => {
  const { name, identificationNo, email } = user;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: name ?? "",
    },
  });

  const reset = () => {
    setError("");
  };

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    reset();
    startTransition(async () => {
      // Update user
      await apiClient
        .patch("/api/profile", values)
        .then(() => {
          successToast({ message: "Profile Updated Successfully!" });
        })
        .catch((error) => {
          setError(error.response.data.error);
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <CommonInput
          control={form.control}
          name="name"
          label="Full name"
          disabled={isPending}
          placeholder="Your full name..."
        />
        <div className="space-y-1">
          <Label htmlFor="identificationNo">Identification number</Label>
          <Input
            id="identificationNo"
            defaultValue={identificationNo}
            disabled
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="current">Email address</Label>
          <Input id="current" defaultValue={email ?? ""} disabled />
        </div>
        {error && <FormErrorMessage message={error} />}

        <Button type="submit" disabled={isPending}>
          Save changes
        </Button>
      </form>
    </Form>
  );
};
