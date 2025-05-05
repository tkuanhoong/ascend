"use client";

import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { formattedToMYR } from "@/lib/currency";
import { unexpectedErrorToast } from "@/lib/toast";
import { useTransition } from "react";

interface PurchaseCourseButtonProps {
  price: number;
  courseId: string;
}

const PurchaseCourseButton = ({
  price,
  courseId,
}: PurchaseCourseButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(async () => {
      try {
        const {
          data: { url },
        } = await apiClient.post(`/api/courses/${courseId}/checkout`);

        window.location.assign(url);
      } catch (error) {
        unexpectedErrorToast();
        console.log(error);
      }
    });
  };
  return (
    <Button onClick={onClick} className="font-medium" disabled={isPending}>
      Purchase for {formattedToMYR(price)}
    </Button>
  );
};

export default PurchaseCourseButton;
