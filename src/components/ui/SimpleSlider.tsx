interface SimpleSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  displayValue?: string;
}

export const SimpleSlider = ({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  displayValue,
}: SimpleSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-medium text-neutral-300">
          {label}
        </label>
        <span className="text-xs font-mono text-white bg-neutral-700 px-1.5 py-0.5 rounded">
          {displayValue || value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
    </div>
  );
};