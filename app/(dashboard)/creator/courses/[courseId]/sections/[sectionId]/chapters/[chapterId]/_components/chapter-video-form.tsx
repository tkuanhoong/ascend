"use client";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, TimerIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileDropZone } from "@/components/file-drop-zone";
import { Chapter, Video } from "@/prisma/app/generated/prisma/client";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import apiClient from "@/lib/axios";
import { z } from "zod";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface ChapterVideoFormProps {
  initialData: Chapter & { video?: Video | null };
}

export const ChapterVideoForm = ({ initialData }: ChapterVideoFormProps) => {
  const { courseId, sectionId, chapterId } = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.patch(
        `/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`,
        values
      );
      successToast({ message: "Chapter updated" });
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
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : !initialData.video?.isReady ? (
          <div className="flex flex-col items-center justify-center h-60 bg-slate-200 rounded-md">
            <TimerIcon className="h-10 w-10 text-slate-500" />
            <div className="text-xs text-muted-foreground mt-2">
              Videos can take a few minutes to process. Refresh the page if
              video does not appear.
            </div>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video src={initialData.videoUrl} controls/>
          </div>
        ))}
      {isEditing && (
        <div>
          <FileDropZone
            endpoint="chapterVideo"
            onChange={({ url }) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
    </div>
  );
};
