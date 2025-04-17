import { CircleCheck } from "lucide-react";

interface FormSuccessMessageProps {
  message: string;
}
export const FormSuccessMessage = ({ message }: FormSuccessMessageProps) => {
  return (
    <div className="bg-emerald-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-600">
      <CircleCheck className="h-4 min-w-4" />
      <p>{message}</p>
    </div>
  );
};
