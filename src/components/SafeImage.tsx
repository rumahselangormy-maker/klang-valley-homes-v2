import React, { useState, useEffect } from 'react';
import { getFallbackPlaceholder, transformImageUrl } from '../data/placeholders';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  propertyType?: string;
  projectId?: string;
  fallbackSrc?: string;
  alt?: string;
  disableFallback?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  propertyType,
  projectId,
  fallbackSrc,
  alt = 'Property Image',
  disableFallback = false,
  className = '',
  ...props
}) => {
  const transformedSrc = transformImageUrl(src);
  const defaultFallback = fallbackSrc || getFallbackPlaceholder(propertyType, projectId);
  const [currentSrc, setCurrentSrc] = useState<string>(transformedSrc || (disableFallback ? '' : defaultFallback));
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const updated = transformImageUrl(src);
    setCurrentSrc(updated || (disableFallback ? '' : defaultFallback));
    setHasError(false);
  }, [src, defaultFallback]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(disableFallback ? '' : defaultFallback);
    }
  };

  if (!currentSrc) return null;
  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};
