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

export default function DeleteCategoryModal({
  category,
  onClose,
  onSuccess,
}: Props) {

  const handleDelete = async () => {
    try {
      await api.delete(
        `/setup/delete-category/${category.id}`
      );

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <ModalWrapper
      title="Delete Category"
      onClose={onClose}
    >
      <div className="space-y-4">

        <p>
          Are you sure you want to delete
          <b> {category.name}</b>?
        </p>

        <div className="flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded"
          >
            Delete
          </button>

        </div>

      </div>
    </ModalWrapper>
  );
}