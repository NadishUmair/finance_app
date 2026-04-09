import ModalWrapper from "./modalsWrapper";
import api from "../../lib/axiosInstance";

interface Account {
  id: number;
  name: string;
  type: string;
}

interface Props {
  account: Account;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAccountModal({
  account,
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
        "accountName"
      ) as HTMLInputElement
    ).value;

    const type = (
      form.elements.namedItem(
        "accountType"
      ) as HTMLSelectElement
    ).value;

    try {
      await api.put(
        `/setup/update-account/${account.id}`,
        { name, type }
      );

      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <ModalWrapper
      title="Edit Account"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="accountName"
          defaultValue={account.name}
          className="w-full border p-2 rounded"
        />

        <select
          name="accountType"
          defaultValue={account.type}
          className="w-full border p-2 rounded"
        >
          <option value="BANK">Bank</option>
          <option value="CASH">Cash</option>
          <option value="CREDIT_CARD">
            Credit Card
          </option>
        </select>

        <button className="w-full bg-black text-white py-2 rounded">
          Update Account
        </button>
      </form>
    </ModalWrapper>
  );
}