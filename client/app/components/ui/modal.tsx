import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  title,
  children,
  onClose,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">

        {/* Close Button */}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Title */}

        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>

        {/* Content */}

        {children}

      </div>

    </div>
  );
}