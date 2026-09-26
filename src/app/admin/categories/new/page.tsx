import CategoryForm from "../components/CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Add Category
      </h1>

      <CategoryForm action={createCategory} />
    </div>
  );
}
