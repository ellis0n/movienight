import React, { useState, useEffect } from 'react';
import { navigate } from 'astro:transitions/client';


const OMDB_URL = 'https://www.omdbapi.com/?apikey='

interface ImageTooltipProps {
  title: string;
}

const ImageTooltip: React.FC<{ title: string }> = ({ title }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        setImageUrl(null);
        
        const fetchImage = async () => {
            if (!title) return;
            
            try {
                const response = await fetch(`${OMDB_URL}${import.meta.env.PUBLIC_OMDB_API_KEY}&t=${encodeURIComponent(title)}`);
                const data = await response.json();
                setImageUrl(data.Poster);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [title]);

    if (!title) return null;

    return (
        <div className="bg-gray-800 text-white rounded-md shadow-md overflow-hidden p-2 w-40">
            <h3 className="text-xs font-semibold mb-1 truncate">{title}</h3>
            <div className="relative w-full pb-[150%]"> {/* 2:3 aspect ratio */}
                {imageUrl ? (
                    <img 
                        style={{ viewTransitionName: `${imageUrl}` }}
                        src={imageUrl} 
                        alt={title} 
                        loading='lazy'
                        className="absolute top-0 left-0 w-full h-full object-contain bg-gray-700"
                    />
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageTooltip;
