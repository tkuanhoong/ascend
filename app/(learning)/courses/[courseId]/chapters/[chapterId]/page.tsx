import { EditorPreview } from "@/components/editor-preview";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { redirect } from "next/navigation";
import { File } from "lucide-react";
import Link from "next/link";

export default async function ChapterPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { chapterId } = await params;
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      video: true,
      attachments: true,
    },
  });

  if (!chapter) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-50">
      <AspectRatio ratio={16 / 9}>
        <video
          src={chapter.videoUrl ?? ""}
          autoPlay
          controls
          className="w-full rounded-xl"
        />
      </AspectRatio>
      <div className="flex flex-col space-y-3">
        <Button className="ml-auto items-end">Mark as Completed</Button>
        <h1 className="text-2xl font-semibold">{chapter.title}</h1>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-md font-semibold mb-2">Chapter Description</h2>
          <EditorPreview value={chapter.description ?? ""} />
        </div>
        {chapter.attachments.length > 0 && (
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-md font-semibold mb-2">Chapter Resources</h2>
            <div className="space-y-2 pl-4">
              {chapter.attachments.map((attachment) => (
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
