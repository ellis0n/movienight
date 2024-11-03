import React from 'react';

interface ImageTooltipProps {
  data: {
    title: string;
    poster?: string;
    color?: string;
    pickedBy?: string;
    year?: string;
    runtime?: string;
    pickedByColor?: string;
    pickedByName?: string;
  };
}

const ImageTooltip: React.FC<ImageTooltipProps> = ({ data }) => {
  return (
    <div className="bg-gray-900/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-xs border border-gray-700">
      <div className="flex gap-4">
        {data.poster && (
          <img 
            src={data.poster} 
            alt={data.title} 
            className="w-24 h-36 object-cover rounded-md shadow-lg"
          />
        )}
        
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-white/90">
            {data.title}
          </h3>
          
          {data.pickedByName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Picked by</span>
              <span 
                className="font-medium"
                style={{ color: data.pickedByColor }}
              >
                {data.pickedByName}
              </span>
            </div>
          )}

          <div className="text-sm text-gray-400 flex items-center gap-2">
            {data.year && <span>{data.year}</span>}
            {data.year && data.runtime && 
              <span className="w-1 h-1 rounded-full bg-gray-600" />
            }
            {data.runtime && <span>{data.runtime}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTooltip;
