import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  SectionActions,
  SectionTitleForm,
  SectionLevelForm,
  SectionTimeForm,
  ChapterForm,
} from "./_components";
import { Bolt, TableOfContents, Timer } from "lucide-react";
import { CustomBreadcrumb } from "@/components/custom-breadcrumbs";
import { IconBadge } from "@/components/icon-badge";
import { SectionLevel } from ".prisma/client";
import { getCourseSectionWithChapters } from "@/data/section/get-course-sections";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string }>;
}) {
  const { courseId, sectionId } = await params;
  const user = await currentUser();
  const section = await getCourseSectionWithChapters({ sectionId, courseId });
  if (!user || !section) {
    redirect("/");
  }

  const requiredFields = [
    {
      isCompleted: !!section.title,
      message: "Section Title is required",
    },
    {
      isCompleted: !!section.level,
      message: "Section Level is required",
    },
    {
      isCompleted: !!section.estimatedTime,
      message: "Time to Complete (in minutes) is required",
    },
    {
      isCompleted: section.chapters.some((chapter) => chapter.isPublished),
      message: "At least 1 chapter is published",
    },
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((e) => e.isCompleted).length;

  const inCompletedFields = requiredFields.filter((e) => !e.isCompleted);

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every((e) => e.isCompleted);

  const levels = Object.values(SectionLevel).map((value) => {
    const label = value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return {
      label,
      value,
    };
  });

  const redirectableRoutes = [
    {
      label: "Course",
      href: `/creator/courses/${courseId}`,
    },
  ];

  return (
    <div className="p-6">
      <CustomBreadcrumb
        currentPageLabel="Section"
        redirectableRoutes={redirectableRoutes}
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Edit Section</h1>
          {
            !isComplete && 
              <div>
                <span className="text-sm text-slate-600">Please complete the required fields {completionText}</span>
                {inCompletedFields.map((e, index) => (
                  <li className="text-sm text-slate-600" key={index}>{e.message}</li>
                ))}
              </div>
          }
        </div>
        <SectionActions
          disabled={!isComplete}
          courseId={courseId}
          sectionId={sectionId}
          isPublished={section.isPublished}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Bolt} />
            <h2 className="text-xl">Edit section content</h2>
          </div>
          <SectionTitleForm
            initialData={section}
            courseId={courseId}
            sectionId={sectionId}
          />
          <SectionLevelForm
            initialData={section}
            courseId={courseId}
            sectionId={sectionId}
            options={levels}
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Timer} />
            <h2 className="text-xl">Estimated time to complete</h2>
          </div>
          <SectionTimeForm
            initialData={section}
            courseId={courseId}
            sectionId={sectionId}
          />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={TableOfContents} />
              <h2 className="text-xl">Reorganise Chapters</h2>
            </div>
            <ChapterForm
              initialData={section}
              courseId={courseId}
              sectionId={sectionId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
