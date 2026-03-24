'use client';

import { useState } from 'react';

export default function ImageWithFallback({ src, alt, fallback = '/images/placeholder-craft.svg', ...props }) {
  const [imageSrc, setImageSrc] = useState(src || fallback);
  return <img src={imageSrc || fallback} alt={alt} onError={() => setImageSrc(fallback)} {...props} />;
}
