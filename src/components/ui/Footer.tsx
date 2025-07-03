import { useMemo, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { estimateTokens, downloadJson } from '../../utils';
import { Download, Clipboard, Check } from 'lucide-react';

export const Footer = () => {
  const [isCopied, setIsCopied] = useState(false);
  const currentPrompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === state.currentPromptId)
  );

  const { charCount, tokenCount } = useMemo(() => {
    if (!currentPrompt) return { charCount: 0, tokenCount: 0 };
    const text = currentPrompt.blocks.map((b) => b.content).join('\n\n');
    return {
      charCount: text.length,
      tokenCount: estimateTokens(text),
    };
  }, [currentPrompt]);

  const handleCopy = async () => {
    if (!currentPrompt) return;
    const assembledText = currentPrompt.blocks
      .map((b) => `// ${b.type.toUpperCase()}\n${b.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(assembledText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!currentPrompt) return;
    const sanitizedName = currentPrompt.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadJson(currentPrompt, `${sanitizedName}.json`);
  };

  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-t border-neutral-800 text-sm">
      <div className="flex items-center gap-4 text-neutral-400">
        <div>
          <span>
            {charCount.toLocaleString()} CHARS / {tokenCount.toLocaleString()} TOKENS
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 text-neutral-300 rounded-md hover:bg-neutral-800 hover:text-white"
          title="Download the current prompt as a .json file"
        >
          <Download className="w-4 h-4" /> <span className='hidden md:block'>Download</span>
        </button>
        <button
          onClick={handleCopy}
          disabled={isCopied}
          className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-70 font-bold"
          title="Copy the final assembled prompt to your clipboard"
        >
          {isCopied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Clipboard className="w-4 h-4" />
          )}
          <span className='hidden md:block'>
            {isCopied ? 'COPIED!' : 'COPY PROMPT'}
          </span>
        </button>
      </div>
    </footer>
  );
};