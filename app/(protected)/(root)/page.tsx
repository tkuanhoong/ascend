import { CourseCard } from "@/components/course/course-card";
import { db } from "@/lib/db";
import { CourseStatus } from "@/prisma/app/generated/prisma/client";
import { CategoryButtons } from "./_components/category-buttons";
import SearchBar from "@/components/search-bar";

interface HomePageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const { title, categoryId } = await searchParams;

  const courses = await db.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      title: {
        contains: title,
      },
      categoryId,
    },
    include: {
      category: true,
    },
  });

  const categories = await db.category.findMany();

  return (
    <main className="min-h-screen p-8 sm:pb-20">
      <div className="flex justify-center items-center p-4 md:hidden">
        <SearchBar />
      </div>
      <CategoryButtons categories={categories} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
      </div>
      {!courses.length && (
        <div className="flex w-full items-center justify-center">
          No matching course
        </div>
      )}
    </main>
  );
}
