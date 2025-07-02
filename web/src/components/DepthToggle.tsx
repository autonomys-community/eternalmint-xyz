"use client";

import { useDepth } from "@/contexts/DepthContext";

export const DepthToggle: React.FC = () => {
  const { depthEnabled, toggleDepth } = useDepth();

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-300">3D Effects:</span>
      <button
        onClick={toggleDepth}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black ${
          depthEnabled 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
            : 'bg-gray-600'
        }`}
        role="switch"
        aria-checked={depthEnabled}
        aria-label="Toggle 3D depth effects"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
            depthEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-xs ${depthEnabled ? 'text-blue-400' : 'text-gray-500'}`}>
        {depthEnabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}; 