
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
  
  // Enhanced HEIC/HEIF detection with multiple checks
  const isHeicFile = (
    // Check file extension in URL
    src.toLowerCase().includes('.heic') || 
    src.toLowerCase().includes('.heif') ||
    // Check for blob URLs with HEIC data attribute
    (src.startsWith('blob:') && rest['data-heic'] === 'true') ||
    // Check for query parameters that might indicate HEIC origin
    (src.includes('?') && src.includes('heic=true')) ||
    // Check for custom attribute directly indicating HEIC
    rest['data-format'] === 'heic'
  );

  // Special handling for HEIC-specific issues in Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const needsSpecialHandling = isHeicFile && isSafari;
  
  return (
    <div className={`relative ${className}`} style={{ minHeight: "20px" }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
      
      {/* Removed the HEIC badge as requested */}
      
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
          // More detailed error logging for debugging
          console.error(`Failed to load image: ${src}`, {
            isHeicFile,
            errorEvent: e,
            imageProps: {
              width,
              height,
              src,
              dataHeic: rest['data-heic'],
              dataFormat: rest['data-format']
            }
          });
          setHasError(true);
          setIsLoading(false);
        }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
