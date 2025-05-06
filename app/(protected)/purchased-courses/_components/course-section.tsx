"use client";

import { CourseCard } from "@/components/course/course-card";
import { Course } from "@/prisma/app/generated/prisma/client";
import React from "react";

interface CourseSectionProps {
  courses: Course[];
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
          <CourseCard key={course.title} course={course} />
        ))}
      </div>
    </div>
  );
};
