import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../components/CategoryForm";
import { updateCategory } from "../../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: Props) {
  const { id } = await params;

  const category =
    await prisma.category.findUnique({
      where: { id },
    });

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Category
      </h1>

      <CategoryForm
        initialData={{
          name: category.name,
          description: category.description,
        }}
        action={updateCategory.bind(null, id)}
      />
    </div>
  );
}
