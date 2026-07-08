interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export default function AdBanner({ format = 'horizontal', className = '' }: AdBannerProps) {
  const dimensions = {
    horizontal: 'h-24 sm:h-28',
    vertical: 'h-64 sm:h-80',
    square: 'h-64 w-64 sm:h-80 sm:w-80',
  };

  return (
    <div
      className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${dimensions[format]} ${className}`}
    >
      <div className="text-center">
        <p className="text-sm text-gray-400 font-medium">Advertisement</p>
        <p className="text-xs text-gray-300 mt-1">Google AdSense Space</p>
      </div>
    </div>
  );
}
