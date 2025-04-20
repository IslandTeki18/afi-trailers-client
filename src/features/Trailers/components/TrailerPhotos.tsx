import * as React from 'react';

type TrailerPhotosProps = {
  photoUrls?: string[];
  onRemove?: (url: string) => void;
};

export const TrailerPhotos = ({
  photoUrls = [],
  onRemove,
}: TrailerPhotosProps) => {
  if (photoUrls.length === 0) {
    return <p className="text-sm text-gray-500">No photos uploaded.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {photoUrls.map((url) => (
        <div
          key={url}
          className="relative border rounded overflow-hidden group"
        >
          <img src={url} alt="Trailer" className="w-full h-32 object-cover" />
          {onRemove && (
            <button
              onClick={() => onRemove(url)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
