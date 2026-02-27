import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 16, showValue = false, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            size={size}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          />
        </button>
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
