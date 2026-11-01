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
        <h1>狐火</h1>
        <p className="lead">按分类打开一题，对照参考作答。</p>
      </header>
      <SearchForm />
      <table className="ledger">
        <thead>
          <tr>
            <th scope="col">分类</th>
            <th scope="col">题数</th>
            <th scope="col">范围</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <Link href={`/category/${category.id}`}>{category.name}</Link>
              </td>
              <td className="num">{counts[category.id]}</td>
              <td className="muted">{category.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="help">题库共 {totalQuestions} 题，进度写在这台设备上。</p>
    </AppShell>
  );
}
