import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="relative p-3 flex flex-col items-center justify-center max-w-lg w-full">
                <button
                    onClick={onClose}
                    className="absolute top-3 bg-gray-200 text-gray-500 p-4 rounded-full hover:bg-gray-300"
                    aria-label="Close"
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m6 6 12 12m0-12L6 18" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Modal;
