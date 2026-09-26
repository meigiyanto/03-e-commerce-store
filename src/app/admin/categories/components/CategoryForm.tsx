type Props = {
  action: (formData: FormData) => void;
  initialData?: {
    name: string;
    description: string | null;
  };
};

export default function CategoryForm({
  action,
  initialData,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Category Name
        </label>

        <input
          type="text"
          name="name"
          defaultValue={initialData?.name}
          required
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description ?? ""}
          className="w-full rounded-lg border px-4 py-2"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Save Category
      </button>
    </form>
  );
}
