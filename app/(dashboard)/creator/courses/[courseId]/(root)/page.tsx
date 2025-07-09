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
    {
      isCompleted: !!course.title,
      message: "Course Title is required",
    },
    {
      isCompleted: !!course.description,
      message: "Course Description is required",
    },
    {
      isCompleted: !!course.imageUrl,
      message: "Course Image is required",
    },
    {
      isCompleted: !!course.price,
      message: "Course Price is required",
    },
    {
      isCompleted: !!course.categoryId,
      message: "Course Category is required",
    },
    {
      isCompleted: course.sections.some((section) => section.isPublished),
      message: "At least 1 section is published",
    },
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((e) => e.isCompleted).length;

  const inCompletedFields = requiredFields.filter((e) => !e.isCompleted);

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every((e) => e.isCompleted);

  return (
    <div className="p-6">
      <CustomBreadcrumb currentPageLabel="Course" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          {!isComplete && (
            <div>
              <span className="text-sm text-slate-600">
                Please complete the required fields {completionText}
              </span>
              {inCompletedFields.map((e, index) => (
                <li className="text-sm text-slate-600" key={index}>
                  {e.message}
                </li>
              ))}
            </div>
          )}
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
