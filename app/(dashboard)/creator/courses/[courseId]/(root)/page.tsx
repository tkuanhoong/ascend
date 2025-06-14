import { IconBadge } from "@/components/icon-badge";
import { currentUser } from "@/lib/auth";
import { Bolt, DollarSign, TableOfContents } from "lucide-react";
import { redirect } from "next/navigation";
import {
  PriceForm,
  CategoryForm,
  DescriptionForm,
  ImageForm,
  TitleForm,
  SectionForm,
} from "./_components";
import { CourseActions } from "./_components/course-actions";
import { CustomBreadcrumb } from "@/components/custom-breadcrumbs";
import { getCourseWithSectionsWithPurchases } from "@/data/course/get-course-with-sections-with-purchase";
import { getAllCategories } from "@/data/category";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }

  const { courseId } = await params;
  const course = await getCourseWithSectionsWithPurchases(courseId);

  const categories = await getAllCategories();

  if (!course) {
    return redirect("/creator/courses");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.sections.some((section) => section.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <CustomBreadcrumb currentPageLabel="Course" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-600">
            Complete all fields {completionText}
          </span>
        </div>
        <CourseActions
          disabled={!isComplete}
          courseId={courseId}
          courseStatus={course.status}
          purchaseCount={course.purchases.length}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Bolt} />
            <h2 className="text-xl">Edit course content</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-x-2">
            <IconBadge icon={DollarSign} />
            <h2 className="text-xl">Monetise your course</h2>
          </div>
          <PriceForm initialData={course} courseId={course.id} />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={TableOfContents} />
              <h2 className="text-xl">Reorganise Sections</h2>
            </div>
            <SectionForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
