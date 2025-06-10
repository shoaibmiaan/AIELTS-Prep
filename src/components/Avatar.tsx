'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Avatar({ src }: { src: string }) {
  const [imgSrc, setImgSrc] = useState(src || '/default-avatar.png');

  return (
    <Image
      src={imgSrc}
      alt="Avatar"
      width={56}
      height={56}
      className="rounded-full object-cover"
      onError={() => setImgSrc('/default-avatar.png')}
      placeholder="blur"
      blurDataURL="/blur-avatar.png"
    />
  );
}
