"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import qs from "query-string";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search...",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <form onSubmit={onSubmit} className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </div>
  );
}
