
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
 * with improved performance and loading states
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  loading,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if the image is from an external source or local
  const isExternal = src.startsWith('http') || src.startsWith('//');
  
  // Generate appropriate srcSet for responsive images
  const generateSrcSet = () => {
    if (isExternal) {
      return undefined; // For external images, browser handles this better
    }
    
    // For local images, create responsive breakpoints
    const widths = [640, 750, 828, 1080, 1200, 1920];
    return widths.map(w => `${src} ${w}w`).join(', ');
  };
  
  // Set loading attribute based on priority
  const loadingAttribute = priority ? 'eager' : loading || 'lazy';
  
  // Add fetchpriority attribute if supported
  const fetchPriority = priority ? 'high' : 'auto';
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: "20px" }}>
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
        loading={loadingAttribute}
        decoding={priority ? 'sync' : 'async'}
        srcSet={generateSrcSet()}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          console.error(`Failed to load image: ${src}`);
          setHasError(true);
          setIsLoading(false);
        }}
        fetchPriority={fetchPriority}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
