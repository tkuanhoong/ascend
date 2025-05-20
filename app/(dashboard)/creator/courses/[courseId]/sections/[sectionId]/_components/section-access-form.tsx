"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";
import { Section } from "@/generated/prisma";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

interface SectionAccessFormProps {
  initialData: Section;
  courseId: string;
  sectionId: string;
}

export const SectionAccessForm = ({
  initialData,
  courseId,
  sectionId,
}: SectionAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree,
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
        Section access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit access
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}
        >
          {initialData.isFree ? (
            <>This section is free for preview.</>
          ) : (
            <>This section is not free.</>
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isFree"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      <label
                        htmlFor="isFree"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Allow free preview for this section, all chapters under
                        this section will be accessible for free
                      </label>
                    </FormDescription>
                  </div>
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
