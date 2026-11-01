import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SearchForm } from "@/components/SearchForm";
import { categories } from "@/lib/categories";
import { countByCategory, totalQuestions } from "@/data/questions";

export default function HomePage() {
  const counts = countByCategory();

  return (
    <AppShell current="home">
      <header className="mast">
        <p className="mast__kicker">AI 应用面试</p>
        <h1>狐火</h1>
        <p className="lead">按分类打开一题，对照参考作答。</p>
      </header>
      <SearchForm />
      <ul className="cat-grid">
        {categories.map((category) => (
          <li key={category.id}>
            <Link className="cat-card" href={`/category/${category.id}`}>
              <span className="cat-card__name">{category.name}</span>
              <span className="cat-card__count num">{counts[category.id]} 题</span>
              <span className="cat-card__summary">{category.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="help">题库共 {totalQuestions} 题，进度写在这台设备上。</p>
    </AppShell>
  );
}
