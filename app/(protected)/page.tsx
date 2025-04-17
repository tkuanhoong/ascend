import { CourseCard } from "@/components/course/course-card";

export default function Home() {
    return (
        <main className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-screen p-8 gap-4 sm:pb-20" >
        <CourseCard />
        < CourseCard />
        <CourseCard />
        < CourseCard />
        <CourseCard />
        < CourseCard />
        <CourseCard />
        < CourseCard />
        <CourseCard />
        < CourseCard />
        <CourseCard />
        </main>
  );
}