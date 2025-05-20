import { CreditCard, DollarSign, ScanEye, Users } from "lucide-react";
import { SectionCard } from "../../../../../components/dashboard/section-card";
import { formattedToMYR } from "@/lib/currency";

interface SectionCardsProps {
  totalRevenue: number | null;
  totalPurchases: number;
  totalUserCount: number;
  totalCoursesPendingReviewCount: number;
}

export function AdminSectionCards({
  totalRevenue,
  totalPurchases,
  totalUserCount,
  totalCoursesPendingReviewCount,
}: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
      <SectionCard
        title="Total Revenue"
        value={formattedToMYR(totalRevenue ?? 0)}
        Icon={DollarSign}
      />
      <SectionCard
        title="Total Purchases"
        value={totalPurchases}
        Icon={CreditCard}
      />

      <SectionCard title="Total Users" value={totalUserCount} Icon={Users} />

      <SectionCard
        title="Courses Pending Review"
        value={totalCoursesPendingReviewCount}
        Icon={ScanEye}
      />
    </div>
  );
}
