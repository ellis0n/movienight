import React, { useState, useEffect, useRef } from 'react';
import { actions } from 'astro:actions';

interface EditableRatingCellProps {
    value: number | null;
    ratingId: string;
    viewerId: string;
    isEditable: boolean;
    onUpdate: (newValue: number) => void;
}

const EditableRatingCell: React.FC<EditableRatingCellProps> = ({
    value,
    ratingId,
    viewerId,
    isEditable,
    onUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (newValue === value) {
            setIsEditing(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('score', newValue?.toString() ?? '');
            formData.append('id', ratingId);

            // Update local state immediately for a snappy UI feel
            onUpdate(newValue!);
            
            // Then update the database
            const response = await actions.ratings.updateScore(formData);
            
            if (!response.data?.success) {
                // If DB update fails, revert the local state
                onUpdate(value!);
                console.error('Failed to update rating');
            }
            
            setIsEditing(false);
        } catch (error) {
            // If there's an error, revert the local state
            onUpdate(value!);
            console.error('Error updating rating:', error);
        }
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    if (!value) return <span>-</span>;
    
    if (!isEditable) {
        return <span className="hover:bg-blue-500/10 transition-colors p-1 rounded">{value}</span>;
    }

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="flex items-center space-x-1">
                <input
                    ref={inputRef}
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={newValue ?? ''}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    onBlur={() => handleSubmit()}
                    className="w-16 px-1 py-0.5 text-sm bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
            </form>
        );
    }

    return (
        <button 
            onClick={() => setIsEditing(true)}
            className="hover:bg-blue-500/10 transition-colors p-1 rounded text-blue-400 hover:text-blue-300"
        >
            {value}
        </button>
    );
};

export default EditableRatingCell;
