import { useUiStore } from '../../store/uiStore';
import { PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileControlsProps {
  showLeft?: boolean;
}

export const MobileControls = ({ showLeft = false }: MobileControlsProps) => {
  const { isLeftSidebarOpen, actions } = useUiStore();

  if (!showLeft) {
    return null;
  }

  return (
    <div className="fixed bottom-16 right-4 z-50 flex flex-col gap-2">
      {showLeft && (
        <button
          onClick={() => actions.toggleSidebar('left')}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-white shadow-lg transition-colors hover:bg-neutral-700',
            isLeftSidebarOpen && 'bg-orange-500'
          )}
          title="Toggle Left Sidebar"
        >
          <PanelLeft className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
