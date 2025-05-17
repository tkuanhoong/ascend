"use client";
import { FileInput } from "@/components/form/file-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { JSONFileSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type formSchema = z.infer<typeof JSONFileSchema>;

export const ImportCourseForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<formSchema>({
    resolver: zodResolver(JSONFileSchema),
    defaultValues: {
      file: undefined,
    },
  });
  const onSubmit = async (values: formSchema) => {
    startTransition(async () => {
      try {
        const form = new FormData();
        form.append("file", values.file);
        const res = await apiClient.post("/api/courses/import", form);
        const { success, course } = res.data;
        router.push(`/creator/courses/${course.id}`);
        successToast({ message: success });
      } catch (error) {
        console.log(error);
        unexpectedErrorToast();
      }
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="flex flex-col gap-3 w-full"
      >
        <h1 className="text-2xl font-bold">Import your course</h1>
        <p className="text-lg font-medium">Upload the course backup file</p>
        <FileInput
          control={form.control}
          name="file"
          type="file"
          label="Course backup file (.json)"
          placeholder="eg. Amazing course name"
          accept="application/json"
          disabled={isPending}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/creator/courses")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            Continue
          </Button>
        </div>

        <div>
          <Button variant="link" className="p-0" asChild>
            <Link href="/creator/courses/create">
              Create course from scratch？
            </Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
