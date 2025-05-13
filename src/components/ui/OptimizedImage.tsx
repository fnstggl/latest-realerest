
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
 * with improved performance and loading states and better error handling
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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
  }, [src]);
  
  // Check if the image is from an external source or local
  const isExternal = src ? (src.startsWith('http') || src.startsWith('//')) : true;
  
  // Check if image might be a HEIC/HEIF format based on URL parameters
  const isHeicFormat = src ? src.includes('format=heic') : false;
  
  // Check if URL is from Supabase storage
  const isSupabaseStorageUrl = src && 
    (src.includes('supabase.co') && src.includes('/storage/v1/object/public/'));
  
  // Generate appropriate srcSet for responsive images
  const generateSrcSet = () => {
    if (!src || isExternal || isHeicFormat) {
      return undefined; // For external or HEIC images, browser handles this better
    }
    
    // For local images, create responsive breakpoints
    const widths = [640, 750, 828, 1080, 1200, 1920];
    return widths.map(w => `${src} ${w}w`).join(', ');
  };
  
  // Set loading attribute based on priority
  const loadingAttribute = priority ? 'eager' : loading || 'lazy';
  
  // Add fetchpriority attribute if supported
  const fetchPriority = priority ? 'high' : 'auto';
  
  // Better placeholder for when image fails to load
  const placeholderImage = '/placeholder.svg';
  
  // Handle image src safely with retry mechanism for Supabase storage URLs
  let safeImageSrc = src || placeholderImage;
  
  // Add special handling for Supabase storage URLs
  if (isSupabaseStorageUrl) {
    try {
      // Parse the Supabase URL
      const urlObj = new URL(safeImageSrc);
      
      // Check if this is a Supabase storage URL that might be affected by policy issues
      if (urlObj.pathname.includes('/storage/v1/object/public/')) {
        // Ensure we're using the latest version and bypass any caching issues
        if (retryCount > 0) {
          // Add cache-busting parameter if retrying
          urlObj.searchParams.set('t', Date.now().toString());
          urlObj.searchParams.set('retry', retryCount.toString());
        }
        safeImageSrc = urlObj.toString();
      }
    } catch (e) {
      console.error("Error parsing Supabase URL:", e);
      // Continue with original URL if parsing fails
    }
  }
  
  // Handle retry logic
  const handleImageError = () => {
    console.error(`Failed to load image: ${safeImageSrc}`);
    
    if (isSupabaseStorageUrl && retryCount < maxRetries) {
      console.log(`Retrying Supabase image load (${retryCount + 1}/${maxRetries}): ${safeImageSrc}`);
      setRetryCount(prevCount => prevCount + 1);
      // Keep loading state true as we're retrying
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ minHeight: "20px" }}
      data-image-type={isHeicFormat ? 'heic-converted' : 'standard'}
      data-supabase-storage={isSupabaseStorageUrl ? 'true' : 'false'}
      data-retry-count={retryCount}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
      
      <img
        src={hasError ? placeholderImage : safeImageSrc}
        alt={alt || ''}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        sizes={sizes}
        loading={loadingAttribute}
        decoding={priority ? 'sync' : 'async'}
        srcSet={generateSrcSet()}
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
        fetchPriority={fetchPriority as any}
        {...rest}
      />
      
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          Image not available
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
