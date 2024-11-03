import React, { useState, useRef, useEffect } from 'react';
import { actions } from 'astro:actions';

interface EditableRatingCellProps {
    value: number | null;
    ratingId: number;
    isEditable: boolean;
    onUpdate: (newValue: number) => void;
}

const EditableRatingCell: React.FC<EditableRatingCellProps> = ({
    value,
    ratingId,
    isEditable,
    onUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>(value?.toString() ?? '');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setCurrentValue(value?.toString() ?? '');
    }, [value]);

    const handleCancel = () => {
        setCurrentValue(value?.toString() ?? '');
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const numValue = Number(currentValue);
        
        if (!currentValue || isNaN(numValue)) {
            handleCancel();
            return;
        }

        if (numValue === value) {
            setIsEditing(false);
            return;
        }

        if (numValue >= 0 && numValue <= 10) {
            try {
                const formData = new FormData();
                formData.append('score', numValue.toString());
                formData.append('id', ratingId.toString());
                onUpdate(numValue);
                const response = await actions.ratings.updateScore(formData);
                
                if (response?.data?.success === false) {
                    onUpdate(value!);
                    console.error('Failed to update rating:', response?.data?.error);
                }
                setIsEditing(false);
            } catch (error) {
                onUpdate(value!);
                console.error('Error updating rating:', error);
                setIsEditing(false);
            }
        }
    };

    if (!isEditable) {
        return <span className="block text-center">{value ?? '-'}</span>;
    }

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="flex justify-center">
                <input
                    ref={inputRef}
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    placeholder={value?.toString() ?? '-'}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onBlur={handleSubmit}
                    onKeyDown={handleKeyDown}
                    className="w-12 px-1 py-0.5 text-sm text-center bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
            </form>
        );
    }

    return (
        <button 
            onClick={() => setIsEditing(true)}
            className="block w-full text-center text-blue-400 hover:text-blue-300"
        >
            {value ?? '-'}
        </button>
    );
};

export default EditableRatingCell;
