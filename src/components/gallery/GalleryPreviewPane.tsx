import { useMemo, useState } from 'react';
import { Prompt } from '../../types';
import { Clipboard, Check, Download, Edit } from 'lucide-react';
import { downloadJson, loadGalleryPromptIntoStorage } from '../../utils';

interface GalleryPreviewPaneProps {
  prompt: Prompt | null;
  width: number;
}

export const GalleryPreviewPane = ({ prompt, width }: GalleryPreviewPaneProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const assembledText = useMemo(() => {
    if (!prompt) return '';
    return prompt.blocks
      .map((b) => `// ${b.type.toUpperCase()}\n${b.content}`)
      .join('\n\n');
  }, [prompt]);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(assembledText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!prompt) return;
    const sanitizedName = prompt.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadJson(prompt, `${sanitizedName}.json`);
  };

  const handleLoad = () => {
    if (!prompt) return;
    loadGalleryPromptIntoStorage(prompt);
  };

  if (!prompt) {
    return (
      <aside
        style={{ width: `${width}px` }}
        className="bg-neutral-900 p-4 border-l border-neutral-800 flex-shrink-0 flex items-center justify-center h-full"
      >
        <div className="text-center text-neutral-500">
          <p>Select a prompt to see the preview.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-neutral-900 p-4 border-l border-neutral-800 flex flex-col flex-shrink-0 h-full"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-2 gap-4">
          <h3 className="font-bold tracking-wider text-neutral-300 truncate" title={prompt.name}>
            {prompt.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleLoad}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold"
              title="Load into Editor"
            >
              <Edit className="w-4 h-4" /> Load
            </button>
            <button
              onClick={handleDownload}
              className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
              title="Download Prompt as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              disabled={isCopied}
              className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-70"
              title="Copy Assembled Prompt"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <pre className="w-full h-full p-3 bg-black rounded-md whitespace-pre-wrap text-sm text-neutral-300 font-mono overflow-auto max-h-[calc(100vh-150px)] border border-neutral-800">
          {assembledText}
        </pre>
      </div>
    </aside>
  );
};