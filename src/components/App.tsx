import { useState, useCallback } from 'react';
import { usePromptStore } from '../store/promptStore';
import { Header } from './ui/Header';
import { LeftSidebar } from './ui/LeftSidebar';
import { Footer } from './ui/Footer';
import { NoPromptView } from './editor/NoPromptView';
import { EditorContent } from './editor/EditorContent';
import { TemplatesView } from './templates/TemplatesView';

export const App = () => {
  const currentView = usePromptStore((state) => state.currentView);
  const currentPromptId = usePromptStore((state) => state.currentPromptId);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);

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

  return (
    <div className="bg-black text-white flex flex-col h-screen overflow-hidden font-mono">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar width={leftSidebarWidth} />
        <div
          onMouseDown={handleMouseDown}
          className="w-1 cursor-col-resize bg-neutral-800 hover:bg-orange-500/50 transition-colors"
          title="Resize sidebar"
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentView === 'editor' ? <Editor /> : <TemplatesView />}
        </main>
      </div>
      {currentView === 'editor' && currentPromptId && <Footer />}
    </div>
  );
};