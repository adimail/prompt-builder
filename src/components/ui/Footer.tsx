import { useMemo, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { estimateTokens, downloadJson } from '../../utils';

export const Footer = () => {
  const [isCopied, setIsCopied] = useState(false);
  const currentPrompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === state.currentPromptId)
  );

  const { fullText, charCount, tokenCount } = useMemo(() => {
    if (!currentPrompt) return { fullText: '', charCount: 0, tokenCount: 0 };
    const text = currentPrompt.blocks.map((b) => b.content).join('\n\n');
    return {
      fullText: text,
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
    <footer className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-gray-200 dark:border-gray-700 text-sm">
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
        <div>
          <span>
            {charCount.toLocaleString()} chars / {tokenCount.toLocaleString()} tokens
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          title="Download the current prompt as a .json file"
        >
          <span className="material-icons text-base">download</span> Download
        </button>
        <button
          onClick={handleCopy}
          disabled={isCopied}
          className="copy-prompt-btn flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-70"
          title="Copy the final assembled prompt to your clipboard"
        >
          <span className="material-icons text-base">{isCopied ? 'done' : 'content_copy'}</span>
          {isCopied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>
    </footer>
  );
};