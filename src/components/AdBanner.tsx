export default function AdBanner({ format = 'horizontal', className = '' }: { format?: 'horizontal' | 'square'; className?: string }) {
  if (format === 'square') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-xl ${className}`} style={{ minHeight: '250px' }}>
        <span className="text-sm text-gray-400">Advertisement</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-xl ${className}`} style={{ minHeight: '90px' }}>
      <span className="text-sm text-gray-400">Advertisement</span>
    </div>
  );
}
