import React, { useState, useRef, useEffect } from 'react';
import { actions } from 'astro:actions';
import RatingInput from './RatingInput';

interface EditableRatingCellProps {
    value: number | null;
    ratingId?: number;
    movieId: number;
    viewerId: number;
    isEditable: boolean;
    onUpdate: (newValue: number, ratingId?: number) => void;
}

const EditableRatingCell: React.FC<EditableRatingCellProps> = ({
    value,
    ratingId,
    movieId,
    viewerId,
    isEditable,
    onUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentRatingId, setCurrentRatingId] = useState(ratingId);

    console.log("isEditable", isEditable);

    console.log('EditableRatingCell props:', { value, ratingId, isEditable });

    const handleClick = () => {
        console.log('Cell clicked, current value:', value);
        console.log('Current ratingId:', ratingId);
        setIsEditing(true);
    };

    const handleSubmit = async (newValue: number) => {
        try {
            const formData = new FormData();
            formData.append('score', newValue.toString());

            // Create new rating
            if (value === null && movieId && viewerId) {
                formData.append('movieId', movieId.toString());
                formData.append('viewerId', viewerId.toString());
                const { data } = await actions.ratings.createRating(formData);
                if (data?.success && data.data?.id) {
                    setCurrentRatingId(Number(data.data.id));
                    onUpdate(newValue, Number(data.data.id));
                } else {
                    console.error('Failed to create rating:', data?.error);
                }

            // Update existing rating
            } else if (currentRatingId) {
                formData.append('id', currentRatingId.toString());
                const { data } = await actions.ratings.updateScore(formData);

                if (data?.success) {
                    onUpdate(newValue, currentRatingId);
                } else {
                    onUpdate(value!, currentRatingId);
                    console.error('Failed to update rating:', data?.error);
                }
            }
            setIsEditing(false);
        } catch (error) {
            if (value !== null) onUpdate(value, currentRatingId);
            console.error('Error handling rating:', error);
            setIsEditing(false);
        }
    };

    if (!isEditable) {
        return <span className="block text-center">{value ?? '-'}</span>;
    }

    if (isEditing) {
        return (
            <RatingInput
                initialValue={value ?? 5}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                autoFocus
            />
        );
    }

    if (value === null) {
        return (
            <button
                onClick={handleClick}
                className="w-full h-full text-center text-gray-400 hover:text-white transition-colors"
            >
                +
            </button>
        );
    }

    return (
        <button 
            onClick={handleClick}
            className="block w-full text-center text-blue-400 hover:text-blue-300"
        >
            {value}
        </button>
    );
};

export default EditableRatingCell;
