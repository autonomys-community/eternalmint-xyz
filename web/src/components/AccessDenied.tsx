"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

interface AccessDeniedProps {
  title?: string;
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Access Denied",
  message = "You need MINTER_ROLE to access this feature."
}) => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-400 mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        
        {!isConnected ? (
          <button
            onClick={openConnectModal}
            className="px-6 py-3 bg-gradient-to-r from-[#1E58FC] via-[#D914E4] to-[#F10419] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-sm text-gray-400">
            <p>Contact an administrator to get MINTER_ROLE permissions.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 