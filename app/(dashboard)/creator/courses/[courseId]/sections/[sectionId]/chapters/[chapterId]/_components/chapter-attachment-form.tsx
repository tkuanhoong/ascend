"use client";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { FileDropZone } from "@/components/file-drop-zone";
import apiClient from "@/lib/axios";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { Chapter, Attachment } from "@/prisma/app/generated/prisma/client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().optional(),
});

interface ChapterAttachmentFormProps {
  initialData: Chapter & { attachments: Attachment[] };
}

export const ChapterAttachmentForm = ({
  initialData,
}: ChapterAttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { courseId, sectionId, chapterId } = useParams();
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const apiRoute = `/api/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/attachments`;

  useEffect(() => {
    if (!isEditing) {
      setFileName("");
    }
  }, [isEditing]);

  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await apiClient.post(apiRoute, values);
      successToast({ message: "Chapter attachment created" });
      toggleEdit();
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  };
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await apiClient.delete(`${apiRoute}/${id}`);
      successToast({ message: "Chapter attachment deleted" });
      router.refresh();
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Resources
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No resources yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border border-indigo-200 text-indigo-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <Link href={attachment.url} target="_blank">
                    <p className="text-xs line-clamp-1 hover:underline">
                      {attachment.name}
                    </p>
                  </Link>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <Label htmlFor="filename">Save as</Label>
          <Input
            id="filename"
            onChange={(e) => setFileName(e.target.value)}
            disabled={isUploading}
          />
          <FileDropZone
            endpoint="chapterAttachment"
            onChange={({ url, name }) => {
              if (url) {
                onSubmit({ url, name });
              }
              setFileName("");
            }}
            fileNameToRename={fileName}
            onFileNameChange={setFileName}
            onUploadChange={setIsUploading}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Allowed files: text, image, video, audio, pdf, word, excel, slides
            (max file size: 128MB)
          </div>
        </div>
      )}
    </div>
  );
};
