
import React, { useState } from 'react';

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
  
  // Check if the image is from an external source or local
  const isExternal = src.startsWith('http') || src.startsWith('//');
  
  // Default widths for responsive images
  const defaultSrcSet = isExternal ? undefined : 
    `${src} 640w, ${src} 750w, ${src} 828w, ${src} 1080w, ${src} 1200w`;
  
  // Handle HEIC/HEIF files specifically
  const isHeicFile = src.toLowerCase().includes('.heic') || 
                    src.toLowerCase().includes('.heif') ||
                    (src.startsWith('blob:') && rest['data-heic'] === 'true');
  
  return (
    <div className={`relative ${className}`} style={{ minHeight: "20px" }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
      
      <img
        src={hasError ? '/placeholder.svg' : src}
        alt={alt || ''}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        srcSet={defaultSrcSet}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          // Fallback if image fails to load
          console.error(`Failed to load image: ${src}${isHeicFile ? ' (HEIC format)' : ''}`);
          setHasError(true);
          setIsLoading(false);
        }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
