import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import { Bolt, Eye, UploadIcon } from "lucide-react";
import { CustomBreadcrumb } from "@/components/custom-breadcrumbs";
import { IconBadge } from "@/components/icon-badge";
import {
  ChapterAccessForm,
  ChapterActions,
  ChapterAttachmentForm,
  ChapterDescriptionForm,
  ChapterTitleForm,
  ChapterVideoForm,
} from "./_components";
import { getChapterWithVideoAndAttachments } from "@/data/chapter/get-chapter-with-video-and-attachments";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string; chapterId: string }>;
}) {
  const { courseId, sectionId, chapterId } = await params;
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  const chapter = await getChapterWithVideoAndAttachments(chapterId);

  if (!chapter) {
    redirect("/");
  }
  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  const redirectableRoutes = [
    {
      label: "Course",
      href: `/creator/courses/${courseId}`,
    },
    {
      label: "Section",
      href: `/creator/courses/${courseId}/sections/${sectionId}`,
    },
  ];

  return (
    <div className="p-6">
      <CustomBreadcrumb
        currentPageLabel="Chapter"
        redirectableRoutes={redirectableRoutes}
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Edit Chapter</h1>
          <span className="text-sm text-slate-600">
            Complete all fields {completionText}
          </span>
        </div>
        <ChapterActions
          disabled={!isComplete}
          isPublished={chapter.isPublished}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Bolt} />
            <h2 className="text-xl">Edit chapter content</h2>
          </div>
          <ChapterTitleForm initialData={chapter} />
          <ChapterDescriptionForm initialData={chapter} />
          <ChapterAttachmentForm initialData={chapter} />
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Eye} />
            <h2 className="text-xl">Access Control</h2>
          </div>
          <ChapterAccessForm initialData={chapter} />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={UploadIcon} />
              <h2 className="text-xl">Upload your video</h2>
            </div>
            <ChapterVideoForm initialData={chapter} />
          </div>
        </div>
      </div>
    </div>
  );
}
