import { useUiStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

const fontSizes = [
  { name: 'S', size: 12 },
  { name: 'M', size: 14 },
  { name: 'L', size: 16 },
  { name: 'XL', size: 18 },
];

export const FontSizeControl = () => {
  const fontSize = useUiStore((state) => state.fontSize);
  const setFontSize = useUiStore((state) => state.actions.setFontSize);

  return (
    <div>
      <h3 className="text-xl font-semibold tracking-wider mb-4">Appearance</h3>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-neutral-300">Global Font Size</label>
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 p-1">
          {fontSizes.map(({ name, size }) => (
            <button
              key={name}
              onClick={() => setFontSize(size)}
              className={cn(
                'w-full rounded-md px-4 py-2 text-sm font-bold transition-colors',
                fontSize === size
                  ? 'bg-orange-500 text-white'
                  : 'text-neutral-300 hover:bg-neutral-700'
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="text-xs text-neutral-500 font-sans">
          Adjust the base font size for the entire application.
        </p>
      </div>
    </div>
  );
};