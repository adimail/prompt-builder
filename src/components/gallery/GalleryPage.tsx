import { useState, useEffect, useCallback } from 'react';
import { fetchGalleryPrompts } from '../../api';
import { Prompt } from '../../types';
import { GalleryCard } from './GalleryCard';
import { GalleryPreviewPane } from './GalleryPreviewPane';
import { Rocket, Loader, AlertTriangle } from 'lucide-react';

const GalleryHeader = () => (
  <header className="flex items-center justify-between px-6 h-16 bg-neutral-950 border-b border-neutral-800 shadow-sm flex-shrink-0">
    <div className="flex items-center gap-3">
      <h1 className="md:text-xl text-sm font-bold text-orange-500 tracking-wider">
        PROMPT GALLERY
      </h1>
    </div>
    <a
      href="studio.html"
      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-bold md:text-sm text-xs inline-flex items-center gap-2"
    >
      <Rocket className="w-4 h-4" />
      Go to Studio
    </a>
  </header>
);

export const GalleryPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rightPaneWidth, setRightPaneWidth] = useState(window.innerWidth * 0.4);

  useEffect(() => {
    fetchGalleryPrompts()
      .then((data) => {
        setPrompts(data);
        if (data.length > 0) {
          setSelectedPromptId(data[0].id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load prompts from the gallery.');
        setIsLoading(false);
      });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = rightPaneWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth - (moveEvent.clientX - startX);
        if (newWidth > 300 && newWidth < window.innerWidth * 0.8) {
          setRightPaneWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [rightPaneWidth]
  );

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId) || null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-neutral-500">
          <Loader className="w-12 h-12 animate-spin mb-4" />
          <p>Loading Prompts...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p>{error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {prompts.map((prompt) => (
          <GalleryCard
            key={prompt.id}
            prompt={prompt}
            isSelected={selectedPromptId === prompt.id}
            onClick={() => setSelectedPromptId(prompt.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-black text-white flex flex-col h-screen overflow-hidden font-mono">
      <GalleryHeader />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-y-auto p-6">{renderContent()}</main>
        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize bg-neutral-800 hover:bg-orange-500/50 transition-colors"
          title="Resize preview pane"
        />
        <GalleryPreviewPane prompt={selectedPrompt} width={rightPaneWidth} />
      </div>
    </div>
  );
};