"use client";

import { TextAreaInput } from "@/components/form/text-area-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { AICourseDescriptionSchema, AICourseImportSchema } from "@/lib/zod";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import apiClient from "@/lib/axios";
import { useRouter } from "next/navigation";
import { FormErrorMessage } from "@/components/form/form-error-message";
import Link from "next/link";

type formSchema = z.infer<typeof AICourseDescriptionSchema>;

const CourseDescriptionForm = () => {
  const { submit, isLoading, error } = useObject({
    api: "/api/ai/generate-course",
    schema: AICourseImportSchema,
    onFinish: async (data) => {
      await apiClient
        .post("/api/courses/ai-create", data.object)
        .then((res) => {
          const { course } = res.data;
          successToast({ message: "Course generated successfully" });
          router.push(`/creator/courses/${course.id}`);
        })
        .catch((error) => {
          console.log(error);
          unexpectedErrorToast();
        });
    },
    onError: (error) => {
      console.log(error);
      unexpectedErrorToast();
    },
  });

  const form = useForm<formSchema>({
    resolver: zodResolver(AICourseDescriptionSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const router = useRouter();

  const onSubmit = (values: formSchema) => {
    submit(values);
  };

  return (
    <>
      {error && <FormErrorMessage message={error.message} />}
      <h1 className="text-2xl font-bold">AI Course Generator</h1>
      <p className="text-lg font-medium">
        Generate your course structure using AI.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TextAreaInput
            control={form.control}
            label="What's your course about?"
            name="prompt"
            disabled={isLoading}
          />
          <Button disabled={isLoading}>Submit</Button>
        </form>
      </Form>
      <div>
        <Button variant="link" className="p-0" asChild>
          <Link href="/creator/courses/create">
            Create course from scratch？
          </Link>
        </Button>
      </div>
    </>
  );
};

export default CourseDescriptionForm;
