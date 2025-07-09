"use client";

import { useCallback, useState, useTransition } from "react";
import { SectionDataTable } from "./section-data-table";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { SelectedSection } from "@/app/api/courses/[courseId]/backup/route";
import { successToast, unexpectedErrorToast } from "@/lib/toast";
import { useRouter } from "next/navigation";

interface Chapter {
  id: string;
  title: string;
}

interface Section {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface CourseDataTableProps {
  courseId: string;
  sections: Section[];
}

export function SectionTables({ courseId, sections }: CourseDataTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedSections, setSelectedSections] = useState<SelectedSection[]>(
    []
  );
  const [isConfirm, setIsConfirm] = useState(false);

  const handleSelectionChange = useCallback(
    (updatedSection: SelectedSection) => {
      setSelectedSections((prev) => {
        // Remove existing entry for this section if it exists
        const filtered = prev.filter((s) => s.id !== updatedSection.id);

        return [...filtered, updatedSection];
      });
    },
    []
  );

  const handleSelectionDelete = useCallback((sectionId: string) => {
    setSelectedSections((prev) => {
      // Remove existing entry for this section if it exists
      const filtered = prev.filter((s) => s.id !== sectionId);

      return filtered;
    });
  }, []);

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await apiClient.post(`/api/courses/${courseId}/backup`, {
          selectedSections,
        });
        successToast({ message: "Successfully created course backup" });
        router.push("/creator/backups");
      } catch (error) {
        console.log(error);
        unexpectedErrorToast();
      }
    });
  };

  return (
    <>
      {sections.map((section) => (
        <SectionDataTable
          key={section.id}
          courseId={courseId}
          initialSection={section}
          handleSelectionChange={handleSelectionChange}
          handleSelectionDelete={handleSelectionDelete}
          disabled={isConfirm}
        />
      ))}
      <div className="flex items-center justify-center space-x-2">
        {isConfirm && (
          <>
            <Button onClick={() => setIsConfirm(false)} disabled={isPending}>
              Back
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              Submit
            </Button>
          </>
        )}
        {!isConfirm && (
          <Button onClick={() => setIsConfirm(true)}>Continue</Button>
        )}
      </div>
    </>
  );
}
