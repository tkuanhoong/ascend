"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartArea } from "lucide-react";

type ChartDataEntry = {
  date: string;
  amount: number;
};

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: ChartDataEntry[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Handle toggle group change to prevent deselection
  const handleTimeRangeChange = (value: string) => {
    if (value) {
      // Only update if a value is selected (not empty)
      setTimeRange(value);
    }
  };

  // Function to generate complete date range with zero-filled amounts
  const generateCompleteData = (
    originalData: ChartDataEntry[],
    days: number
  ) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Create a map of existing data for quick lookup
    const dataMap = new Map<string, number>();
    originalData.forEach((item) => {
      dataMap.set(item.date, item.amount);
    });

    // Generate all dates in the range
    const completeData: ChartDataEntry[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      completeData.push({
        date: dateStr,
        amount: dataMap.get(dateStr) || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return completeData;
  };

  const getFilteredData = () => {
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    return generateCompleteData(data, daysToSubtract);
  };

  const filteredData = getFilteredData();

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-md min-[540px]:text-2xl">
          Total Revenue
        </CardTitle>
        <CardDescription>
          <span className="hidden min-[540px]:block">
            Total for the last 3 months
          </span>
          <span className="block min-[540px]:hidden">Last 3 months</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={handleTimeRangeChange}
            variant="outline"
            className="hidden min-[820px]:flex"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-full min-[820px]:hidden"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {data.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <ChartArea size="60" />
              <div className="text-lg font-medium">
                Not enough data available
              </div>
              <p className="text-sm text-muted-foreground">
                Check back in a few days!
              </p>
              <p className="mt-2 text-xs text-muted-foreground/70">
                Tip: Revenue updates daily.
              </p>
            </div>
          ) : (
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-MY", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  // Format numbers for display (e.g., 1000 -> 1K)
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`;
                  }
                  return value;
                }}
                domain={[0, "dataMax + 100"]} // Adds 100 padding to the top
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-MY", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="amount"
                type="monotone"
                fill="url(#fillAmount)"
                stroke="var(--color-amount)"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
