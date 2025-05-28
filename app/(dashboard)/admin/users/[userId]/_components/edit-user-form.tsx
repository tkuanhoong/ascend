"use client";

import { CommonInput } from "@/components/form/common-input";
import { SelectInput } from "@/components/form/select-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User, UserRole } from ".prisma/client";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { AdminEditUserFormSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditUserFormProps {
  initialData: User;
}

type EditUserFormData = z.infer<typeof AdminEditUserFormSchema>;

const EditUserForm = ({ initialData }: EditUserFormProps) => {
  const form = useForm({
    resolver: zodResolver(AdminEditUserFormSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      identificationNo: initialData.identificationNo || "",
      role: initialData.role,
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: EditUserFormData) => {
    try {
      await apiClient.patch(`/api/admin/users/${initialData.id}`, values);
      successToast({ message: "User profile updated" });
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
        </div>
        <Button type="submit" disabled={isSubmitting} className="md:ml-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default EditUserForm;
