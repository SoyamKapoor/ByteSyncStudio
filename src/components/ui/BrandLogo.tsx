import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Refined proportions: crisp, detailed, and clear while maintaining a sleek, modern bar height
  const imageSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16 sm:h-20 sm:w-20',
  };

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  const taglineSizes = {
    sm: 'text-[7.5px]',
    md: 'text-[8.5px] sm:text-[9px]',
    lg: 'text-xs sm:text-sm',
  };

  const logoSrc = `${(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')}/images/bytesync_logo.png`;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Left: Original Logo Asset (enlarged for proper visibility) */}
      {!imageError && (
        <img
          src={logoSrc}
          alt="ByteSync Studio Emblem"
          className={`${imageSizes[size]} object-contain shrink-0 rounded-full shadow-[0_0_24px_rgba(0,217,245,0.25)]`}
          onError={() => setImageError(true)}
        />
      )}

      {/* Right: Typography exactly matching the design */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline leading-none">
          <span className={`${textSizes[size]} font-extrabold text-[#FFFFFF] tracking-tight`}>
            Byte
          </span>
          <span className={`${textSizes[size]} font-extrabold text-[#00D9F5] tracking-tight`}>
            Sync
          </span>
          <span className={`${textSizes[size]} font-normal text-[#7E92A9] tracking-normal ml-2`}>
            Studio
          </span>
        </div>
        {showTagline && (
          <span
            className={`${taglineSizes[size]} font-mono font-medium tracking-[0.22em] text-[#00D9F5] uppercase mt-1 leading-none`}
          >
            AI ENGINEERING · SYSTEMS
          </span>
        )}
      </div>
    </div>
  );
};
