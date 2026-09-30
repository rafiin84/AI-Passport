import { CategoryPage } from "@/features/recognition/category-page";
export default async function Page({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; return <CategoryPage id={category} />; }
