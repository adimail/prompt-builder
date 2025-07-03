import { useMemo, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { Clipboard, Check } from 'lucide-react';

interface RightPreviewPaneProps {
  width: number;
}

export const RightPreviewPane = ({ width }: RightPreviewPaneProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const currentPrompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === state.currentPromptId)
  );

  const assembledText = useMemo(() => {
    if (!currentPrompt) return '';
    return currentPrompt.blocks
      .map((b) => `// ${b.type.toUpperCase()}\n${b.content}`)
      .join('\n\n');
  }, [currentPrompt]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(assembledText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-neutral-900 p-4 border-l border-neutral-800 flex flex-col flex-shrink-0 h-full"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold tracking-wider text-neutral-300">ASSEMBLED PROMPT</h3>
          <button
            onClick={handleCopy}
            disabled={isCopied}
            className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-70"
            title="Copy Prompt"
          >
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
          </button>
        </div>
        <pre className="w-full h-full p-3 bg-black rounded-md whitespace-pre-wrap text-sm text-neutral-300 font-mono overflow-auto max-h-[calc(100vh-200px)] border border-neutral-800">
          {assembledText}
        </pre>
      </div>
    </aside>
  );
};