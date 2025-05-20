import { ImportCourseForm } from "./_components/import-course-form";

export default function ImportCourseQPage() {
  return (
    <div className="flex flex-1 gap-4 p-4 pt-0 justify-center items-center">
      <div className="grid max-w-screen-md l w-full gap-3">
        <ImportCourseForm />
      </div>
    </div>
  );
}
