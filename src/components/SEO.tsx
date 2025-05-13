
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  schema?: object;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Realer Estate - Below Market Real Estate Deals',
  description = 'Find below market real estate deals & investment opportunities at Realer Estate. Get access to motivated sellers and off-market properties.',
  canonical,
  image = '/lovable-uploads/7c808a82-7af5-43f9-ada8-82e9817c464d.png',
  type = 'website',
  schema,
  children
}) => {
  const siteUrl = window.location.origin || 'https://donedealfinal.lovable.app';
  const url = canonical ? `${siteUrl}${canonical}` : window.location.href || siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const favicon = '/lovable-uploads/44490515-f297-40ac-a263-afe8590da99f.png';
  
  // Add image dimensions for better SEO
  const imageWidth = 1200;
  const imageHeight = 630;
  
  return (
    <Helmet>
      {/* Standard tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" href={favicon} />
      <link rel="preconnect" href={siteUrl} />
      
      {/* Open Graph with improved image metadata */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={title} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Mobile optimization tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Performance hints */}
      <link rel="preload" href={fullImageUrl} as="image" />
      
      {/* Schema.org structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {children}
    </Helmet>
  );
};

export default SEO;
