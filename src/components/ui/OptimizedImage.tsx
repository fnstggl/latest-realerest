
import React, { useState, useEffect } from 'react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * OptimizedImage component that implements best practices for image loading and rendering
 * with improved HEIC file support
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState<string>(src);

  // Check if the image is from an external source or local
  const isExternal = src?.startsWith('http') || src?.startsWith('//');
  
  // Default widths for responsive images
  const defaultSrcSet = isExternal ? undefined : 
    `${src} 640w, ${src} 750w, ${src} 828w, ${src} 1080w, ${src} 1200w`;
  
  // Handle HEIC/HEIF files specifically
  const isHeicFile = 
    src?.toLowerCase().includes('.heic') || 
    src?.toLowerCase().includes('.heif') ||
    (src?.startsWith('blob:') && rest['data-heic'] === 'true');

  // Effect to handle HEIC files when component mounts or src changes
  useEffect(() => {
    // Reset states when src changes
    setHasError(false);
    setIsLoading(true);
    setImgSrc(src);

    // If it's a HEIC file and we're in a full browser environment
    // add special handling and logging to debug the issue
    if (isHeicFile) {
      console.log(`HEIC image detected: ${src}`, {
        isBlob: src?.startsWith('blob:'),
        dataHeic: rest['data-heic'],
        isHeicInName: src?.toLowerCase().includes('.heic') || src?.toLowerCase().includes('.heif')
      });
    }
  }, [src, isHeicFile]);

  return (
    <div className={`relative ${className}`} style={{ minHeight: "20px" }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
      
      <img
        src={hasError ? '/placeholder.svg' : imgSrc}
        alt={alt || ''}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        srcSet={defaultSrcSet}
        onLoad={() => {
          console.log(`Image loaded successfully: ${src}`);
          setIsLoading(false);
        }}
        onError={(e) => {
          // Log more details about the error
          console.error(`Failed to load image: ${src}`, {
            isHeicFile,
            errorEvent: e,
            imageElement: e.currentTarget
          });
          
          // For HEIC files that fail to load directly, try to use a placeholder
          // but maintain the original image dimensions if possible
          setHasError(true);
          setIsLoading(false);
        }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
