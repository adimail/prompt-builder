import { useState, useCallback, useEffect } from 'react';
import { usePromptStore } from '../store/promptStore';
import { useUiStore } from '../store/uiStore';
import { Header } from './ui/Header';
import { LeftSidebar } from './ui/LeftSidebar';
import { Footer } from './ui/Footer';
import { NoPromptView } from './editor/NoPromptView';
import { EditorContent } from './editor/EditorContent';
import { TemplatesView } from './templates/TemplatesView';
import { SettingsView } from './settings/SettingsView';
import { MobileControls } from './ui/MobileControls';
import { cn } from '../utils/cn';
import { GenerateWithAiModal } from './ui/GenerateWithAiModal';
import { ModelSelectionModal } from './ui/ModelSelectionModal';
import { JsonBuilderView } from './json-builder/JsonBuilderView';
import { AppView } from '../types';

export const App = () => {
  const currentView = usePromptStore((state) => state.currentView);
  const currentPromptId = usePromptStore((state) => state.currentPromptId);
  const { setView } = usePromptStore((state) => state.actions);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  const { fontSize, isLeftSidebarOpen, actions: uiActions } = useUiStore();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') as AppView;
    if (view && ['editor', 'templates', 'settings', 'json-builder'].includes(view)) {
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
      default:
        return <Editor />;
    }
  };

  const showMobileControls = currentView === 'editor' && !!currentPromptId;

  return (
    <div className="bg-black text-white flex flex-col h-screen overflow-hidden font-mono text-base">
      <Header
        onGenerateWithAi={() => setIsGenerateModalOpen(true)}
        onOpenModelSelection={() => setIsModelModalOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div className="hidden md:flex">
          <LeftSidebar
            width={leftSidebarWidth}
            onGenerateWithAi={() => setIsGenerateModalOpen(true)}
          />
          <div
            onMouseDown={handleMouseDown}
            className="w-1 cursor-col-resize bg-neutral-800 hover:bg-orange-500/50 transition-colors"
            title="Resize sidebar"
          />
        </div>

        <div
          className={cn(
            'md:hidden fixed inset-y-0 left-0 z-40 w-80 bg-neutral-900 transform transition-transform duration-300 ease-in-out',
            isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-[500px]'
          )}
        >
          <LeftSidebar width={320} onGenerateWithAi={() => setIsGenerateModalOpen(true)} />
        </div>

        {isLeftSidebarOpen && (
          <div
            onClick={() => uiActions.closeSidebars()}
            className="md:hidden fixed inset-0 bg-black/60 z-30"
          ></div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">{renderMainView()}</main>
      </div>
      {currentView === 'editor' && currentPromptId && <Footer />}

      {showMobileControls && (
        <div className="md:hidden">
          <MobileControls showLeft />
        </div>
      )}

      {isGenerateModalOpen && <GenerateWithAiModal onClose={() => setIsGenerateModalOpen(false)} />}
      {isModelModalOpen && <ModelSelectionModal onClose={() => setIsModelModalOpen(false)} />}
    </div>
  );
};