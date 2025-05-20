import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title: string;
  value: number | string;
  Icon: LucideIcon;
}

export const SectionCard = ({ title, value, Icon }: SectionCardProps) => {
  return (
    <Card className="shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums md:text-3xl">
          {value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Icon />
        </div>
      </CardHeader>
    </Card>
  );
};
