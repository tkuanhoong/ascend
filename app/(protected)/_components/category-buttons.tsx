"use client";

import { Category } from "@/generated/prisma";
import { CategoryItem } from "./category-item";

export const CategoryButtons = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="flex w-full pb-2 mb-2 space-x-4 overflow-x-auto overflow-y-hidden">
      <CategoryItem label="All" />
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          value={category.id}
          label={category.name}
        />
      ))}
    </div>
  );
};
