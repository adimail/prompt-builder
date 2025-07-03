import { useEffect, useState, useCallback } from 'react';
import { usePromptStore } from '../store/promptStore';
import { Header } from './ui/Header';
import { LeftSidebar } from './ui/LeftSidebar';
import { Footer } from './ui/Footer';
import { NoPromptView } from './editor/NoPromptView';
import { EditorContent } from './editor/EditorContent';
import { TemplatesView } from './templates/TemplatesView';

export const App = () => {
  const theme = usePromptStore((state) => state.theme);
  const currentView = usePromptStore((state) => state.currentView);
  const currentPromptId = usePromptStore((state) => state.currentPromptId);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(256);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

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
    <div className="bg-bkg text-content flex flex-col h-screen overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar width={leftSidebarWidth} />
        <div
          onMouseDown={handleMouseDown}
          className="w-1.5 cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-primary/50 transition-colors"
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
