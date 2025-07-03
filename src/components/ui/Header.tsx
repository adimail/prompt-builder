import { Star } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 h-16 bg-neutral-900 border-b border-neutral-800 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="md:text-xl text-sm font-bold text-orange-500 tracking-wider">PROMPT BUILDER</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-orange-500"
          title="Star"
        >
          <Star className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
