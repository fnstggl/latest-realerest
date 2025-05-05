
import React from 'react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * OptimizedImage component that implements best practices for image loading and rendering
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
  // Check if the image is from an external source or local
  const isExternal = src.startsWith('http') || src.startsWith('//');
  
  // Default widths for responsive images
  const defaultSrcSet = isExternal ? undefined : 
    `${src} 640w, ${src} 750w, ${src} 828w, ${src} 1080w, ${src} 1200w`;
  
  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      srcSet={defaultSrcSet}
      onError={(e) => {
        // Fallback if image fails to load
        const target = e.target as HTMLImageElement;
        console.error(`Failed to load image: ${target.src}`);
        target.src = '/placeholder.svg';
        target.onerror = null; // Prevent infinite error loop
      }}
      {...rest}
    />
  );
};

export default OptimizedImage;
