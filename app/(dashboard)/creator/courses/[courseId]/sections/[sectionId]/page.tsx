import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
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
import { SectionLevel } from "@/prisma/app/generated/prisma/client";

export default async function SectionPage({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) {
  const { courseId, sectionId } = await params;
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!section) {
    redirect("/");
  }
  const requiredFields = [
    section.title,
    section.estimatedTime,
    section.level,
    section.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  const redirectableRoutes = [
    {
      label: "Course",
      href: `/creator/courses/${courseId}`,
    },
  ];

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

  return (
    <div className="p-6">
      <CustomBreadcrumb
        currentPageLabel="Section"
        redirectableRoutes={redirectableRoutes}
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Edit Section</h1>
          <span className="text-sm text-slate-600">
            Complete all fields {completionText}
          </span>
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
