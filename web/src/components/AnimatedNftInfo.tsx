"use client";

interface AnimatedNftInfoProps {
  className?: string;
}

export const AnimatedNftInfo: React.FC<AnimatedNftInfoProps> = ({ className = "" }) => {
  return (
    <div className={`p-4 rounded-xl shadow-lg border border-white/15 backdrop-filter backdrop-blur-md bg-gradient-to-br from-blue-900/20 to-purple-900/20 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="text-2xl">🎞️</div>
        <h3 className="text-lg font-semibold text-white">Animated NFTs</h3>
      </div>
      
      <div className="space-y-3 text-sm text-gray-300">
        <div className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <div>
            <p className="text-white font-medium">GIF Animation Support</p>
            <p>Upload animated GIF files to create truly animated NFTs that preserve their motion</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-green-400 mt-1">✓</span>
          <div>
            <p className="text-white font-medium">Fully Decentralized</p>
            <p>Animations are stored on Autonomys Auto Drive, ensuring eternal accessibility</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">💡</span>
          <div>
            <p className="text-white font-medium">Pro Tip</p>
            <p>Keep GIF file sizes reasonable (under {5}MB) for optimal loading performance</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-xs text-gray-400">
          Supported formats: JPG, PNG, <span className="text-blue-400 font-medium">GIF (animated)</span>, WebP
        </p>
      </div>
    </div>
  );
}; 