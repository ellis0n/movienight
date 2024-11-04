import React, { useState } from 'react';
import RatingInput from './RatingInput';
import { actions } from 'astro:actions';

interface AddRatingCellProps {
  movieId: number;
  viewerId: number;
  onAdd: (newValue: number) => void;
}

const AddRatingCell: React.FC<AddRatingCellProps> = ({
  movieId,
  viewerId,
  onAdd,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = async (value: number) => {
    try {
      const formData = new FormData();
      formData.append('movieId', movieId.toString());
      formData.append('viewerId', viewerId.toString());
      formData.append('score', value.toString());

      const response = await actions.ratings.createRating(formData);

      if (response?.data?.success) {
        onAdd(value);
        setIsEditing(false);
      } else {
        console.error('Failed to add rating:', response?.data?.error);
      }
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

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
