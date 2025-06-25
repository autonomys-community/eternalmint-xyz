"use client";

import { APP_CONFIG } from "@/config/app";
import { useState } from "react";
import { FaDiscord, FaGithub, FaHeart } from "react-icons/fa";

export const Footer: React.FC = () => {
  const [showEnvInfo, setShowEnvInfo] = useState(false);

  return (
    <footer className="w-full text-white relative">
      <div className="flex justify-center items-center pt-4 pb-0">
        <a
          href="https://github.com/autonomys-community/eternalmint-xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mr-8"
        >
          <FaGithub size={24} />
          <span>GitHub Repo</span>
        </a>
        <p className="flex items-center gap-2">
          Made with <FaHeart className="text-red-500" /> by Marc-Aurèle & the Autonomys Community
        </p>
        <a
          href="https://autonomys.xyz/discord"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-8"
        >
          <FaDiscord className="text-white hover:text-gray-400" size={24} />
        </a>
        
        {/* Environment Info Button */}
        <div className="ml-8 relative">
          <button
            onClick={() => setShowEnvInfo(!showEnvInfo)}
            className="bg-gray-800/90 hover:bg-gray-700/90 text-white px-3 py-1 rounded text-sm font-mono border border-gray-600 transition-colors"
          >
            ENV
          </button>
          
          {showEnvInfo && (
            <div className="absolute bottom-12 right-0 bg-gray-800/95 text-white p-4 rounded-lg border border-gray-600 min-w-80 font-mono text-xs z-50">
              <h3 className="font-bold mb-2 text-sm">Environment Info</h3>
              
              <div className="space-y-1">
                <div>
                  <span className="text-gray-400">EVM Network:</span>{" "}
                  <span className="text-blue-400">{APP_CONFIG.evmNetwork.name}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Storage Network:</span>{" "}
                  <span className="text-green-400">{APP_CONFIG.storageNetwork.name}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">RPC:</span>{" "}
                  <span className="text-gray-300 break-all">{APP_CONFIG.evmNetwork.rpcUrl}</span>
                </div>
                
                <div>
                  <span className="text-gray-400">Contract:</span>{" "}
                  <span className="text-gray-300 break-all">{APP_CONFIG.contract.address}</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowEnvInfo(false)}
                className="mt-3 text-gray-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
