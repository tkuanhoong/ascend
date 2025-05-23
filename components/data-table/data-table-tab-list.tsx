import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table } from "@tanstack/react-table";
import { Label } from "@/components/ui/label";

export type TabOptions = {
  label: string;
  value: string;
  count?: number;
};

export type TabListSettings = {
  tabFilterColumnId: string;
  options: TabOptions[];
};

export interface DataTableTabListProps<TData> {
  table: Table<TData>;
  tabListSettings: TabListSettings;
}

const DataTableTabList = <TData,>({
  table,
  tabListSettings,
}: DataTableTabListProps<TData>) => {
  const { tabFilterColumnId, options } = tabListSettings;
  const ALL = "ALL";
  const handleFilter = (value: string) => {
    if (value === ALL) {
      table.resetColumnFilters();
      return;
    }
    table.getColumn(tabFilterColumnId)?.setFilterValue(value);
  };
  return (
    <Tabs defaultValue={ALL} className="flex items-center pb-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue={ALL} onValueChange={handleFilter}>
          <SelectTrigger className="flex w-fit lg:hidden" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>
            {options.map((status) => (
              <SelectItem value={status.value} key={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TabsList className="hidden lg:flex">
          <TabsTrigger value={ALL} onClick={() => handleFilter(ALL)}>
            All
          </TabsTrigger>
          {options.map((status) => (
            <TabsTrigger
              key={status.value}
              value={status.value}
              onClick={() => handleFilter(status.value)}
              className="gap-1"
            >
              {status.label}
              {/* <Badge
                variant="secondary"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
              >
                3
              </Badge> */}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default DataTableTabList;
