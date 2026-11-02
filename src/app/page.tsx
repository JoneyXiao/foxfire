import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categories } from "@/lib/categories";
import { countByCategory, totalQuestions } from "@/data/questions";

export default function HomePage() {
  const counts = countByCategory();

  return (
    <AppShell current="home">
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-sm font-medium text-primary">AI 应用面试</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight">狐火</h1>
          <p className="max-w-2xl text-muted-foreground">按分类打开一题，对照参考作答。</p>
        </header>
        <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-md bg-muted" />}>
          <SearchForm />
        </Suspense>
        <ul className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/category/${category.id}`} className="block h-full">
                <Card className="h-full transition-colors hover:bg-muted/40">
                  <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                    <CardTitle>{category.name}</CardTitle>
                    <Badge variant="secondary">{counts[category.id]} 题</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{category.summary}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          题库共 {totalQuestions} 题，进度写在这台设备上。
        </p>
      </div>
    </AppShell>
  );
}
