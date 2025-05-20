"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Section } from "@/generated/prisma";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { formatMinutes } from "@/lib/format";

const formSchema = z.object({
  estimatedTime: z.coerce
    .number({ required_error: "Estimated time is required" })
    .nonnegative({ message: "Value cannot be negative" })
    .min(1, { message: "Value must be at least 1" }),
});

interface SectionTimeFormProps {
  initialData: Section;
  courseId: string;
  sectionId: string;
}

export const SectionTimeForm = ({
  initialData,
  courseId,
  sectionId,
}: SectionTimeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estimatedTime: initialData?.estimatedTime || 0.0,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.patch(
        `/api/courses/${courseId}/sections/${sectionId}`,
        values
      );
      successToast({ message: "Section updated" });
      toggleEdit();
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Time to Complete (in minutes)
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.estimatedTime && "text-slate-500 italic"
          )}
        >
          {initialData.estimatedTime
            ? formatMinutes(initialData.estimatedTime)
            : "No estimated time"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      disabled={isSubmitting}
                      placeholder="Set an estimated time for this section"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center mt-2">
              <Button disabled={isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
