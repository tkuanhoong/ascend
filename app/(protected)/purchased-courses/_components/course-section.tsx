"use client";

import { CourseCard } from "@/components/course/course-card";
import {
  Category,
  Course,
  Section,
} from ".prisma/client";
import React from "react";

type SectionWithChapters = Section & {
  chapters: { id: string }[];
};

type CourseWithProgressWithCategory = Course & {
  category: Category;
  sections: SectionWithChapters[];
  progress: number | null;
};

interface CourseSectionProps {
  courses: CourseWithProgressWithCategory[];
  progressLabel: string;
}

export const CourseSection = ({
  courses,
  progressLabel,
}: CourseSectionProps) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-200 p-4 flex justify-between items-center rounded-sm mb-4">
        <div className="flex items-center space-x-2">
          {/* <Icon size="5" /> */}
          <span className="font-medium">{`${courses.length} courses`}</span>
        </div>
        <span className="text-sm">{progressLabel}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            progress={course.progress}
          />
        ))}
      </div>
    </div>
  );
};
