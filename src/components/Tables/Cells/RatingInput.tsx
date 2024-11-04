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
  const [value, setValue] = React.useState<string>(() => {
    if (initialValue === null) return '';
    return initialValue.toString();
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const numValue = parseFloat(parseFloat(value).toFixed(2));
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      onSubmit(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(parseFloat(value).toFixed(2));
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      onSubmit(numValue);
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
        step="0.01"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className="w-12 px-1 py-0.5 text-sm text-center bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
      />
    </form>
  );
};

export default RatingInput;