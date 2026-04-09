import ModalWrapper from "./modalsWrapper";
import api from "../../lib/axiosInstance";

interface Category {
  id: number;
  name: string;
}

interface Props {
  category: Category;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCategoryModal({
  category,
  onClose,
  onSuccess,
}: Props) {
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = (
      form.elements.namedItem(
        "categoryName"
      ) as HTMLInputElement
    ).value;

    try {
      await api.put(
        `/setup/update-category/${category.id}`,
        { name }
      );

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <ModalWrapper
      title="Edit Category"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="categoryName"
          defaultValue={category.name}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Update Category
        </button>
      </form>
    </ModalWrapper>
  );
}