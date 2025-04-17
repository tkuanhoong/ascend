"use client";
import { CommonInput } from "@/components/form/common-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { CreateCourseSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const CreateCourseForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof CreateCourseSchema>) => {
    startTransition(async () => {
      try {
        const res = await apiClient.post("/api/courses", values);
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
        className="flex flex-col gap-3 w-full"
      >
        <h1 className="text-2xl font-bold">Name your course</h1>
        <p className="text-lg font-medium">What is the name of your course?</p>
        <CommonInput
          control={form.control}
          name="title"
          label="Course title"
          placeholder="eg. Amazing course name"
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
      </form>
    </Form>
  );
};
