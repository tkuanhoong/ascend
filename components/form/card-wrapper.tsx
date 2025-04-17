import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string;
  headerDescription?: string;
}

const CardWrapper = ({
  children,
  headerLabel,
  headerDescription,
}: CardWrapperProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{headerLabel}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardWrapper;
