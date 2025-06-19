import { CourseCard } from "@/components/course/course-card";
import { CategoryButtons } from "./_components/category-buttons";
import SearchBar from "@/components/search-bar";
import { getHomeCourses } from "@/data/course/get-home-courses";
import { AiChatButton } from "./_components/ai-chat-button";
import { getAllCategories } from "@/data/category";
import { currentUser } from "@/lib/auth";

interface HomePageProps {
  title: string;
  categoryId: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomePageProps>;
}) {
  const searchQuery = await searchParams;
  const courses = await getHomeCourses({ ...searchQuery });
  const categories = await getAllCategories();
  const user = await currentUser();

  return (
    <main className="relative min-h-screen p-8 sm:pb-20">
      <div className="flex justify-center items-center p-4 md:hidden">
        <SearchBar />
      </div>
      <CategoryButtons categories={categories} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
        {courses.map((course) => (
          <CourseCard
            course={course}
            key={course.id}
            progress={course.progress}
          />
        ))}
      </div>
      {!courses.length && (
        <div className="flex w-full items-center justify-center">
          No matching course
        </div>
      )}
      {user && <AiChatButton />}
    </main>
  );
}
