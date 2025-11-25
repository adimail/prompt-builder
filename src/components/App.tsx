import { useState, useCallback, useEffect } from 'react';
import { usePromptStore } from '../store/promptStore';
import { useUiStore } from '../store/uiStore';
import { Header } from './ui/Header';
import { LeftSidebar } from './ui/LeftSidebar';
import { NoPromptView } from './editor/NoPromptView';
import { EditorContent } from './editor/EditorContent';
import { TemplatesView } from './templates/TemplatesView';
import { SettingsView } from './settings/SettingsView';
import { MobileControls } from './ui/MobileControls';
import { cn } from '../utils/cn';
import { ModelSelectionModal } from './ui/ModelSelectionModal';
import { JsonBuilderView } from './json-builder/JsonBuilderView';
import { ParaphraseView } from './paraphrase/ParaphraseView';
import { AppView } from '../types';
import { Sparkles } from 'lucide-react';

const AiCreationPlaceholder = () => (
  <div className="flex flex-1 flex-col items-center justify-center space-y-6 overflow-y-auto bg-black/50 p-8 text-center">
    <div className="rounded-full border border-neutral-800 bg-neutral-900/50 p-6">
      <Sparkles className="h-16 w-16 animate-pulse text-orange-500" />
    </div>
    <div>
      <h2 className="text-3xl font-bold tracking-wider text-white">AI PROMPT CREATOR</h2>
      <p className="mx-auto mt-4 max-w-md font-sans text-lg text-neutral-400">
        Use the sidebar to describe what you need. The AI will construct a structured prompt for you
        automatically.
      </p>
    </div>
  </div>
);

export const App = () => {
  const currentView = usePromptStore((state) => state.currentView);
  const currentPromptId = usePromptStore((state) => state.currentPromptId);
  const { setView } = usePromptStore((state) => state.actions);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  const { fontSize, isLeftSidebarOpen, actions: uiActions } = useUiStore();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') as AppView;
    if (
      view &&
      ['editor', 'templates', 'settings', 'json-builder', 'paraphrase', 'ai-create'].includes(view)
    ) {
      setView(view);
    }
  }, [setView]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = leftSidebarWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth + moveEvent.clientX - startX;
        if (newWidth > 200 && newWidth < 500) {
          setLeftSidebarWidth(newWidth);
        }
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [leftSidebarWidth]
  );

  const Editor = () => {
    if (!currentPromptId) {
      return <NoPromptView />;
    }
    return <EditorContent />;
  };

  const renderMainView = () => {
    switch (currentView) {
      case 'editor':
        return <Editor />;
      case 'templates':
        return <TemplatesView />;
      case 'settings':
        return <SettingsView />;
      case 'json-builder':
        return <JsonBuilderView />;
      case 'paraphrase':
        return <ParaphraseView />;
      case 'ai-create':
        return <AiCreationPlaceholder />;
      default:
        return <Editor />;
    }
  };

  const showMobileControls = currentView === 'editor' && !!currentPromptId;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-black font-mono text-base text-white">
      <Header
        onGenerateWithAi={() => setView('ai-create')}
        onOpenModelSelection={() => setIsModelModalOpen(true)}
      />
      <div className="relative flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <LeftSidebar width={leftSidebarWidth} onGenerateWithAi={() => setView('ai-create')} />
          <div
            onMouseDown={handleMouseDown}
            className="w-1 cursor-col-resize bg-neutral-800 transition-colors hover:bg-orange-500/50"
            title="Resize sidebar"
          />
        </div>

        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-80 transform bg-neutral-900 transition-transform duration-300 ease-in-out md:hidden',
            isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-[500px]'
          )}
        >
          <LeftSidebar width={320} onGenerateWithAi={() => setView('ai-create')} />
        </div>

        {isLeftSidebarOpen && (
          <div
            onClick={() => uiActions.closeSidebars()}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
          ></div>
        )}

        <main className="flex flex-1 flex-col overflow-hidden">{renderMainView()}</main>
      </div>

      {showMobileControls && (
        <div className="md:hidden">
          <MobileControls showLeft />
        </div>
      )}

      {isModelModalOpen && <ModelSelectionModal onClose={() => setIsModelModalOpen(false)} />}
    </div>
  );
};
