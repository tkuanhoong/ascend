"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { generateCertPDF } from "@/lib/pdfme";
import { unexpectedErrorToast } from "@/lib/toast";
import { DownloadIcon } from "lucide-react";

interface ViewCertificateButtonProps {
  recipientName: string;
  courseName: string;
  identificationNo: string;
}
export const ViewCertificateButton = ({
  recipientName,
  courseName,
  identificationNo,
}: ViewCertificateButtonProps) => {
  function onClick() {
    try {
      generateCertPDF({ recipientName, courseName, identificationNo });
    } catch (error) {
      unexpectedErrorToast();
      console.log(error);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={onClick}>
            <DownloadIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>Download Certificate</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
