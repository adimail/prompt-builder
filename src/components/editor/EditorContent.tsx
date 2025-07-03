import { useState, useCallback } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { debounce } from '../../utils';
import { MainCanvas } from './MainCanvas';
import { RightPreviewPane } from './RightPreviewPane';
import { Eye } from 'lucide-react';

export const EditorContent = () => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [rightPaneWidth, setRightPaneWidth] = useState(450);

  const currentPrompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === state.currentPromptId)
  );
  const updateCurrentPromptName = usePromptStore((state) => state.actions.updateCurrentPromptName);

  const debouncedUpdateName = useCallback(debounce(updateCurrentPromptName, 300), [
    updateCurrentPromptName,
  ]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = rightPaneWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth - (moveEvent.clientX - startX);
        if (newWidth > 300 && newWidth < window.innerWidth * 0.7) {
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

  if (!currentPrompt) return null;

  return (
    <div className="flex-1 flex overflow-hidden">
      <div id="main-canvas-wrapper" className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <input
            key={currentPrompt.id}
            type="text"
            className="text-2xl font-bold bg-transparent rounded-md -ml-2 px-2 py-1 w-full focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500 tracking-wider"
            defaultValue={currentPrompt.name}
            onChange={(e) => debouncedUpdateName(e.target.value)}
            title="Click to rename prompt"
          />
          <button
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white"
            title="Toggle Preview Pane"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
        <MainCanvas />
      </div>
      {isPreviewVisible && (
        <>
          <div
            onMouseDown={handleMouseDown}
            className="w-1 cursor-col-resize bg-neutral-800 hover:bg-orange-500/50 transition-colors"
            title="Resize preview pane"
          />
          <RightPreviewPane width={rightPaneWidth} />
        </>
      )}
    </div>
  );
};