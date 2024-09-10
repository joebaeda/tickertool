"use client";

import FloatingMenu from "@/components/FloatingMenu";
import Network from "@/components/Network";
import NoWalletDetected from "@/components/NoWalletDetected";
import { useWallet, WalletButton } from "@/context/WalletContextProvider";
import { supportedNetwork } from "@/lib/SupportedNetwork";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { signer, isNoWallet, isConnected, isWrongNetwork } = useWallet();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // Toggle audio play and pause
  const handleAudioPlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Audio play error:", err));
    }

    setIsPlaying(!isPlaying);
  };

  const handleUserInteract = () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (audio) {
      audio.play().catch((err) => console.error("Audio play error:", err));
      setIsPlaying(true);
    }

    if (video) {
      video.play().catch((err) => console.error("Video play error:", err));
    }

    setShowOverlay(false);
  };

  useEffect(() => {
    const video = videoRef.current;

    if (video && document.visibilityState === "visible") {
      video.play().catch((err) => console.error("Video play error:", err));
    }
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 overflow-auto">
      {/* Background Video */}
      <video
        className="w-full h-full absolute inset-0 object-cover"
        ref={videoRef}
        muted
        playsInline
        loop
        preload="auto"
      >
        <source
          src="/video/shitcoin-room.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Background Music */}
      <audio loop ref={audioRef}>
        <source
          src="/audio/shitcoin-song.mp3"
          type="audio/mp3"
        />
        Your browser does not support the audio element.
      </audio>

      {/* Logo at Top-Left */}
      <div className="absolute top-4 left-4 max-w-20">
        <Image src="/poop.webp" width={401} height={551} alt="Ticker Tool" priority={true}/>
      </div>

      {/* Play/Pause Button at Top-Left */}
      <button
        onClick={handleAudioPlayPause}
        className="absolute top-10 right-3"
      >
        {isPlaying ? (
          <svg width="60" height="60" fill="#daa520" viewBox="-0.5 0 25 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6.42a3 3 0 0 0-6 0v12a3 3 0 1 0 6 0zm10 0a3 3 0 1 0-6 0v12a3 3 0 1 0 6 0z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="60" height="60" fill="#daa520" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Wallet and Floating Menu */}
      {isNoWallet ? (
        showOverlay ? (
          <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
            <button
              onClick={handleUserInteract}
            >
              <svg width="100" fill="goldenrod" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (<NoWalletDetected />)
      ) : isWrongNetwork ? showOverlay ? (
        <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
          <button
            onClick={handleUserInteract}
          >
            <svg width="100" fill="goldenrod" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : (
        <Network networks={supportedNetwork} />
      ) : !isConnected ? showOverlay ? (
        <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
          <button
            onClick={handleUserInteract}
          >
            <svg width="100" fill="goldenrod" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : (
        <WalletButton />
      ) : (
        signer && showOverlay ? (
          <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center z-10">
            <button
              onClick={handleUserInteract}
            >
              <svg width="100" fill="goldenrod" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.658 9.286c1.44.9 2.16 1.35 2.407 1.926a2 2 0 0 1 0 1.576c-.247.576-.967 1.026-2.407 1.926L9.896 18.94c-1.598.999-2.397 1.498-3.056 1.445a2 2 0 0 1-1.446-.801C5 19.053 5 18.111 5 16.226V7.774c0-1.885 0-2.827.394-3.358a2 2 0 0 1 1.446-.801c.66-.053 1.458.446 3.056 1.445z" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : <FloatingMenu />
      )}
    </div>
  );
}
