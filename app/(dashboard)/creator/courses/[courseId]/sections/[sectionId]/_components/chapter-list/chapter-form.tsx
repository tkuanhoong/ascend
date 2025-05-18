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
import { Chapter, Section } from "@/generated/prisma";
import { CreateChapterSchema } from "@/lib/zod";
import { ChapterList } from "./chapter-list";
import { ModalContextProvider } from "@/components/modal-context-provider";
// import { SectionList } from "./section-list";
// import { ModalContextProvider } from "@/components/modal-context-provider";

const formSchema = CreateChapterSchema;

interface ChapterFormProps {
  initialData: Section & { chapters: Chapter[] };
  courseId: string;
  sectionId: string;
}

export const ChapterForm = ({
  initialData,
  courseId,
  sectionId,
}: ChapterFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, startTransition] = useTransition();
  const isChapterEmpty = !initialData.chapters.length;
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
      await apiClient.post(
        `/api/courses/${courseId}/sections/${sectionId}/chapters`,
        values
      );
      successToast({ message: "Chapter created" });
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
        await apiClient.put(
          `/api/courses/${courseId}/sections/${sectionId}/chapters/reorder`,
          {
            list: updateData,
          }
        );
        successToast({ message: "Chapters reordered" });
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
        {isCreating ? "Chapter title" : "Section Chapters"}
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add chapter
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
                      placeholder="e.g. 'Chapter 1: Your Amazing Chapter Title'"
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
            isChapterEmpty && "text-slate-500 italic"
          )}
        >
          {isChapterEmpty && "No chapters"}
          <ModalContextProvider>
            <ChapterList
              onReorder={onReorder}
              items={initialData.chapters || []}
            />
          </ModalContextProvider>
        </div>
      )}
      {!isCreating && !isChapterEmpty && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
      {!isCreating && isChapterEmpty && (
        <p className="text-xs text-muted-foreground mt-4">
          Seems like you have no chapters. Let&apos;s create one!
        </p>
      )}
    </div>
  );
};
