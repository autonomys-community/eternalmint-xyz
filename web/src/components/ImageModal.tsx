"use client";

import { getImageOptimizationSettings } from "@/utils/mediaUtils";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  title?: string;
  mimeType?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  title,
  mimeType,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Get optimization settings for the image
  const imageSettings = getImageOptimizationSettings(mimeType);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
      setImageDimensions({ width: 0, height: 0 });
    }
  }, [isOpen, imageSrc]);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={handleBackdropClick}
      />
      
      {/* Modal Content */}
      <div className="relative max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          {title && (
            <h3 className="text-xl font-bold text-white truncate mr-4">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Image Container */}
        <div className="relative bg-black/20 rounded-lg backdrop-blur-sm border border-white/10 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center min-h-[300px]">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/20 border-t-purple-500"></div>
                <p className="text-gray-300">Loading image...</p>
              </div>
            </div>
          )}

          {imageError ? (
            <div className="flex items-center justify-center min-h-[300px] p-8">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-lg">Failed to load image</p>
                <p className="text-sm">The image could not be displayed</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageDimensions.width || 800}
                height={imageDimensions.height || 600}
                className="max-w-full max-h-[80vh] object-contain"
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                {...imageSettings}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority
              />
              
              {/* Image Info Overlay */}
              {imageLoaded && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm">
                  {imageDimensions.width} × {imageDimensions.height}
                  {mimeType === 'image/gif' && (
                    <span className="ml-2 text-yellow-400 font-medium">GIF</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Click outside or press ESC to close</p>
        </div>
      </div>
    </div>
  );
}; 