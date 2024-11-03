import React, { useState } from 'react';
import RatingInput from './RatingInput';

interface AddRatingCellProps {
  movieId: number;
  viewerId: number;
  onAdd: (newValue: number) => void;
  disabled?: boolean;
}

const AddRatingCell: React.FC<AddRatingCellProps> = ({
  movieId,
  viewerId,
  onAdd,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = async (value: number) => {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          viewerId,
          score: value
        })
      });

      if (!response.ok) throw new Error('Failed to add rating');
      
      onAdd(value);
      setIsEditing(false);
    } catch (error) {
      console.error('Error adding rating:', error);
      // Optionally add error handling UI
    }
  };

  if (disabled) {
    return <span className="text-gray-500">-</span>;
  }

  if (isEditing) {
    return (
      <RatingInput
        initialValue={5}
        onSubmit={handleAdd}
        onCancel={() => setIsEditing(false)}
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="w-full h-full text-center text-gray-400 hover:text-white transition-colors"
    >
      +
    </button>
  );
};

export default AddRatingCell;
