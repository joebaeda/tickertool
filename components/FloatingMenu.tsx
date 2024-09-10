"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { useWallet } from "@/context/WalletContextProvider";
import Contact from "./Contact";
import Disclaimer from "./Disclaimer";
import DeployToken from "./DeployToken";
import Whitepaper from "./Whitepaper";
import Tutorial from "./Tutorial";

const FloatingMenu = () => {
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { signer, address, balances, network } = useWallet();

    const handleMenuClick = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    const renderModalContent = () => {
        if (modalContent === "S") {
            return <DeployToken signer={signer} address={address} balance={balances} networkChainId={network?.chainIdNumber as number} currencySymbol={network?.ticker as string} blockExplorer={network?.explorer as string} />;
        } else if (modalContent === "H") {
            return <Tutorial currencySymbol={network?.ticker as string} networkName={network?.name as string} />
        } else if (modalContent === "W") {
            return <Whitepaper />
        } else if (modalContent === "C") {
            return <Contact />
        } else if (modalContent === "P") {
            return <Disclaimer />
        }
        return <p>{modalContent}</p>;
    };

    return (
        <div className="fixed bottom-0 w-full">
            <div className="grid h-full w-full gap-4 p-4 grid-cols-5 mx-auto">
                <button onClick={() => handleMenuClick("P")} className="text-3xl inline-flex flex-col items-center justify-center rounded-3xl border-4 bg-[#7e490dfb] hover:bg-[#c07f43cc]">
                    <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m21.406 5.086-9-4a1 1 0 0 0-.812 0l-9 4A1 1 0 0 0 2 6v.7a18.51 18.51 0 0 0 9.515 16.17 1 1 0 0 0 .97 0A18.51 18.51 0 0 0 22 6.7V6a1 1 0 0 0-.594-.914M20 6.7a16.51 16.51 0 0 1-8 14.141A16.51 16.51 0 0 1 4 6.7v-.05l8-3.556 8 3.556ZM11 10h2v8h-2Zm0-4h2v2h-2Z" />
                    </svg>
                </button>
                <button onClick={() => handleMenuClick("H")} className="text-3xl inline-flex flex-col items-center justify-center p-4 rounded-3xl border-4 bg-[#7e490dfb] hover:bg-[#c07f43cc]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8h.01M12 11v5m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button onClick={() => handleMenuClick("S")} className="text-3xl inline-flex flex-col items-center justify-center p-4 rounded-3xl border-4 bg-[#7e490dfb] hover:bg-[#c07f43cc]">
                    <svg height="32" width="32" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198.967 198.967" xmlSpace="preserve">
                        <path d="M181.32 118.14a29.7 29.7 0 0 0 2.154-11.129c0-14.286-10.129-26.25-23.582-29.092.419-2.386.663-4.808.729-7.255l.009-.283q.02-.534.022-1.073c0-.358-.011-.714-.022-1.071l-.009-.276c-.348-12.914-5.636-25-14.893-34.029-9.276-9.05-21.523-14.034-34.485-14.034a7.5 7.5 0 0 0 0 15 2.34 2.34 0 0 1-.001 4.678h-42.41c-16.394 0-29.731 13.338-29.731 29.732 0 2.872.408 5.689 1.196 8.379-14.057 2.355-24.803 14.608-24.803 29.323 0 3.864.741 7.631 2.153 11.128C7.103 123.491 0 134.448 0 146.865c0 17.757 14.446 32.203 32.202 32.203h134.563c17.756 0 32.202-14.446 32.202-32.203 0-12.415-7.104-23.372-17.647-28.725M68.832 54.577h42.411c8.815 0 16.115-6.615 17.199-15.142 10.047 5.753 16.85 16.444 17.185 28.939l.012.361c.006.191.014.382.014.574s-.008.383-.014.574l-.012.367a34.5 34.5 0 0 1-.92 7.029h-88.26a14.63 14.63 0 0 1-2.348-7.971c.002-8.122 6.61-14.731 14.733-14.731M45.226 92.28h108.515c8.124 0 14.733 6.608 14.733 14.731 0 2.809-.797 5.512-2.272 7.847H32.765a14.65 14.65 0 0 1-2.271-7.847c0-8.123 6.609-14.731 14.732-14.731m121.539 71.788H32.202c-9.485 0-17.202-7.717-17.202-17.203 0-8.555 6.313-15.8 14.733-17.007h139.498c8.422 1.207 14.735 8.453 14.735 17.007.001 9.486-7.716 17.203-17.201 17.203" />
                    </svg>
                </button>
                <button onClick={() => handleMenuClick("W")} className="text-3xl inline-flex flex-col items-center justify-center p-4 rounded-3xl border-4 bg-[#7e490dfb] hover:bg-[#c07f43cc]">
                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m26.122 37.435 14.142-14.142c2.828-2.829 4.243-9.9-.707-14.85s-12.02-3.535-14.85-.706L5.617 26.828c-1.414 1.415-3.536 6.364.707 10.607s9.192 2.121 10.607.707l18.384-18.385c1.414-1.414 2.122-4.95 0-7.07-2.121-2.122-5.657-1.415-7.07 0L14.807 26.12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button onClick={() => handleMenuClick("C")} className="text-3xl inline-flex flex-col items-center justify-center p-4 rounded-3xl border-4 bg-[#7e490dfb] hover:bg-[#c07f43cc]">
                    <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.89 3.25H4.11a2 2 0 0 0-2 2v9.06a2 2 0 0 0 2 2h1.64l2.31 4a.85.85 0 0 0 1.48 0l2.32-4h8a2 2 0 0 0 2-2V5.25a2 2 0 0 0-1.97-2M5.01 7.86h6m-6 4h13" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent || ''}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default FloatingMenu;