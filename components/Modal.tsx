import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">

            {/* Modal content container */}
            <div className="flex flex-col items-center justify-center w-full overflow-hidden">

                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg width={40} height={40} fill="white" viewBox="0 -12 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 6H4c-1.104 0-2-.9-2-2s.896-2 2-2h24c1.104 0 2 .9 2 2s-.896 2-2 2m0-6H4a4 4 0 1 0 0 8h24a4 4 0 1 0 0-8" fillRule="evenodd" />
                    </svg>
                </button>

                {/* Scrollable content */}
                <div className="px-4 pb-4 overflow-y-auto max-h-[96vh] custom-scroll">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default Modal;
