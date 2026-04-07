import React, { useState } from "react";
import { createCategory } from "~/services/categoryServices";
import Modal from "../ui/modal";



interface Props {
  organizationId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCategoryModal({
  organizationId,
  onClose,
  onSuccess
}: Props) {

  const [name, setName] =
    useState("");

  const handleSubmit =
    async (e: React.FormEvent) => {

      e.preventDefault();

      try {

        await createCategory({
          name,
          organizationId
        });

        onSuccess();
        onClose();

      } catch (error) {

        console.error(error);

      }

    };

  return (

    <Modal
      title="Create Category"
      onClose={onClose}
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Category Name"
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Save Category
        </button>

      </form>

    </Modal>

  );
}