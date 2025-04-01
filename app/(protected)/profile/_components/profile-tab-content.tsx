"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

interface ProfileTabContentProps {
  value: string;
  title: string;
  description: string;
  children: React.ReactNode;
}
export const ProfileTabContent = ({
  value,
  title,
  description,
  children,
}: ProfileTabContentProps) => {
  return (
    <TabsContent value={value} className="md:mt-0 grow">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </TabsContent>
  );
};
