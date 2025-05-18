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
import { Loader2, PlusCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { Course, Section } from "@/generated/prisma";
import { SectionList } from "./section-list";
import { ModalContextProvider } from "@/components/modal-context-provider";

const formSchema = z.object({
  title: z.string().min(1, { message: "Section title is required" }),
});

interface SectionFormProps {
  initialData: Course & { sections: Section[] };
  courseId: string;
}

export const SectionForm = ({ initialData, courseId }: SectionFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, startTransition] = useTransition();
  const isSectionEmpty = !initialData.sections.length;
  const router = useRouter();

  const toggleCreating = () => setIsCreating((current) => !current);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.post(`/api/courses/${courseId}/sections`, values);
      successToast({ message: "Section created" });
      router.refresh();
      toggleCreating();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };

  const onReorder = (updateData: { id: string; position: number }[]) => {
    startTransition(async () => {
      try {
        await apiClient.put(`/api/courses/${courseId}/sections/reorder`, {
          list: updateData,
        });
        successToast({ message: "Sections reordered" });
        router.refresh();
      } catch (error) {
        unexpectedErrorToast();
        console.log(error);
      }
    });
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-gray-700 animate-spin" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        {isCreating ? "Section title" : "Course Sections"}
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add section
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Topic 1: Introduction'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-2" disabled={isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            isSectionEmpty && "text-slate-500 italic"
          )}
        >
          {isSectionEmpty && "No sections"}
          <ModalContextProvider>
            <SectionList
              onReorder={onReorder}
              items={initialData.sections || []}
            />
          </ModalContextProvider>
        </div>
      )}
      {!isCreating && !isSectionEmpty && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the sections
        </p>
      )}
      {!isCreating && isSectionEmpty && (
        <p className="text-xs text-muted-foreground mt-4">
          Seems like you have no sections. Let&apos;s create one!
        </p>
      )}
    </div>
  );
};
