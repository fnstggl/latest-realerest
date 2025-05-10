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
  
  // Check if image is from Supabase storage
  const isSupabaseStorage = isExternal && src.includes('storage.googleapis.com');
  
  // Generate appropriate srcSet for responsive images
  const generateSrcSet = () => {
    if (isExternal) {
      // For Supabase storage images, we can append width parameters
      if (isSupabaseStorage) {
        const baseSrc = src.split('?')[0]; // Remove any existing query params
        const widths = [640, 750, 828, 1080, 1200, 1920];
        return widths.map(w => `${baseSrc}?width=${w} ${w}w`).join(', ');
      }
      return undefined;
    }
    
    // For local images, create responsive breakpoints
    const widths = [640, 750, 828, 1080, 1200, 1920];
    return widths.map(w => `${src} ${w}w`).join(', ');
  };
  
  // Set loading attribute based on priority
  const loadingAttribute = priority ? 'eager' : loading || 'lazy';
  
  // Handle HEIC/HEIF files specifically
  const isHeicFile = src.toLowerCase().includes('.heic') || 
                    src.toLowerCase().includes('.heif') ||
                    (src.startsWith('blob:') && rest['data-heic'] === 'true');
  
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
          console.error(`Failed to load image: ${src}${isHeicFile ? ' (HEIC format)' : ''}`);
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
