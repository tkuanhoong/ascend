import { EditorPreview } from "@/components/editor-preview";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { redirect } from "next/navigation";
import { File, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { currentUserId } from "@/lib/auth";
import PurchaseCourseButton from "@/app/(protected)/courses/[courseId]/_components/purchase-course-button";
import { getChapterContent } from "@/data/chapter/get-chapter-content";
import { MarkCompletedButton } from "./_components/mark-completed-button";

export default async function ChapterPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { courseId, chapterId } = await params;

  const userId = await currentUserId();
  if (!userId) {
    redirect("/");
  }

  const { course, chapter, attachments, userProgress, purchase } =
    await getChapterContent({
      userId,
      chapterId,
      courseId,
    });

  if (!course || !chapter) {
    redirect("/");
  }

  const isPurchased = !!purchase;
  const isPurchasedOrFree = !!isPurchased || chapter.isFree;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-50">
      {isPurchasedOrFree ? (
        <>
          <AspectRatio ratio={16 / 9}>
            <video
              src={chapter.videoUrl ?? ""}
              controls
              className="w-full rounded-xl"
            />
          </AspectRatio>
          <div className="flex flex-col space-y-3">
            {isPurchased && (
              <MarkCompletedButton
                sectionId={chapter.sectionId}
                isCompleted={userProgress?.isCompleted ?? false}
              />
            )}
            <h1 className="text-2xl font-semibold">{chapter.title}</h1>
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-md font-semibold mb-2">
                Chapter Description
              </h2>
              <EditorPreview value={chapter.description ?? ""} />
            </div>
            {attachments.length > 0 && (
              <div className="bg-white p-4 rounded-md shadow-md">
                <h2 className="text-md font-semibold mb-2">
                  Chapter Resources
                </h2>
                <div className="space-y-2 pl-4">
                  {attachments.map((attachment) => (
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
        </>
      ) : (
        <div className="flex flex-col flex-1 bg-slate-200 rounded-lg justify-center items-center space-y-2">
          <LockKeyhole />
          Paid Content
          <p>Purchase this course to access the content.</p>
          <PurchaseCourseButton price={course.price!} courseId={courseId} />
        </div>
      )}
    </div>
  );
}
