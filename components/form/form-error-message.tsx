import { TriangleAlert } from "lucide-react";

interface FormErrorMessageProps {
  message: string;
}
export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return (
    <div className="bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600">
      <TriangleAlert className="h-4 min-w-4" />
      <p>{message}</p>
    </div>
  );
};
