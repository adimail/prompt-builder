import { useMemo, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';

export const RightPreviewPane = () => {
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
    <aside className="w-1/3 bg-secondary p-4 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Assembled Prompt</h3>
          <button
            onClick={handleCopy}
            disabled={isCopied}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-70"
            title="Copy Prompt"
          >
            <span className="material-icons text-base">{isCopied ? 'done' : 'content_copy'}</span>
          </button>
        </div>
        <pre className="w-full h-full p-2 bg-bkg rounded-md whitespace-pre-wrap text-sm font-mono overflow-auto max-h-[60vh]">
          {assembledText}
        </pre>
      </div>
    </aside>
  );
};