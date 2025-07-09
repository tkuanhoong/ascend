"use client";

import { CommonInput } from "@/components/form/common-input";
import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserRole } from ".prisma/client";
import apiClient from "@/lib/axios";
import { successToast } from "@/lib/toast";
import { AdminCreateUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormErrorMessage } from "@/components/form/form-error-message";

type CreateUserFormData = z.infer<typeof AdminCreateUserSchema>;

const CreateUserForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(AdminCreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      identificationNo: "",
      role: UserRole.USER,
      password: "",
      confirmPassword: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: CreateUserFormData) => {
    await apiClient
      .post("/api/admin/users", values)
      .then(() => {
        successToast({ message: "User created" });
        router.push("/admin/users");
        router.refresh();
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  return (
    <Form {...form}>
      {error && <FormErrorMessage message={error} />}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CommonInput
            control={form.control}
            name="name"
            label="Full Name"
            disabled={isSubmitting}
          />
          <CommonInput
            control={form.control}
            name="email"
            label="Email"
            disabled={isSubmitting}
            type="email"
          />
          <CommonInput
            control={form.control}
            name="identificationNo"
            label="Identification Number (IC No.)"
            disabled={isSubmitting}
          />
          <SelectInput
            control={form.control}
            name="role"
            label="Role"
            options={Object.values(UserRole)}
            placeholder="Select a role"
            description="User's role and permissions level"
            disabled={isSubmitting}
          />
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
        </div>
        <Button type="submit" disabled={isSubmitting} className="md:ml-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreateUserForm;
