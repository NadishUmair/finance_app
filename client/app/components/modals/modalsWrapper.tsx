import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalWrapper({
  title,
  children,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>

        {children}

      </div>
    </div>
  );
}