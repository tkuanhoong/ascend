import { CreditCard, DollarSign, Users } from "lucide-react";
import { SectionCard } from "../../../../../components/dashboard/section-card";
import { formattedToMYR } from "@/lib/currency";

interface CreatorSectionCardsProps {
  totalRevenue: number;
  totalPurchases: number;
  totalLearnerCount: number;
}

export function CreatorSectionCards({
  totalRevenue,
  totalPurchases,
  totalLearnerCount,
}: CreatorSectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-3">
      <SectionCard
        title="Total Revenue"
        value={formattedToMYR(totalRevenue)}
        Icon={DollarSign}
      />
      <SectionCard
        title="Total Purchases"
        value={totalPurchases}
        Icon={CreditCard}
      />

      <SectionCard
        title="Total Learners"
        value={totalLearnerCount}
        Icon={Users}
      />
    </div>
  );
}
