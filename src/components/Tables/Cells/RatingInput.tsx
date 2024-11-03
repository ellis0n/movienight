import React, { useRef, useEffect } from 'react';

interface RatingInputProps {
  initialValue: number | null;
  onSubmit: (value: number) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

const RatingInput: React.FC<RatingInputProps> = ({
  initialValue,
  onSubmit,
  onCancel,
  autoFocus = false
}) => {
  const [value, setValue] = React.useState<number | null>(() => {
    if (initialValue === null) return 5;
    return initialValue;
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value !== null && value >= 0 && value <= 10) {
      onSubmit(value);
    }
  };

  const handleBlur = () => {
    if (value !== null && value >= 0 && value <= 10) {
      handleSubmit();
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <input
        ref={inputRef}
        type="number"
        min="0"
        max="10"
        step="0.1"
        required
        value={value ?? ''} 
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={handleBlur}
        className="w-12 px-1 py-0.5 text-sm text-center bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
      />
    </form>
  );
};

export default RatingInput;