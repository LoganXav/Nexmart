import Link from "next/link";
import type { Category } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryCardProps {
  category: Category;
}

export async function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      aria-label={category.title}
      key={category.title}
      href={`/categories/${category.title}`}
    >
      <Card className="relative h-full w-full overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted">
        {/* <div className="absolute inset-0 z-10 bg-zinc-950/75" /> */}
        <CardHeader className="relative z-20">
          <category.icon className="h-8 w-8" aria-hidden="true" />
        </CardHeader>
        <CardContent className="relative z-20">
          <CardTitle className="text-xl capitalize text-zinc-200">
            {category.title}
          </CardTitle>
          <CardDescription>999 products</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
