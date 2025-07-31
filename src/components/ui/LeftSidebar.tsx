import { usePromptStore } from '../../store/promptStore';
import { BlockLibrary } from '../editor/BlockLibrary';
import { PlusCircle, Folder, Settings, Wand2, FileJson, Edit } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ModelConfig } from '../editor/ModelConfig';

interface LeftSidebarProps {
  width: number;
  onGenerateWithAi: () => void;
}

const NavItem = ({
  label,
  icon: Icon,
  isActive,
  onClick,
  href,
  title,
}: {
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  title: string;
}) => {
  const commonClasses =
    'flex items-center gap-3 p-2.5 rounded-md text-sm w-full transition-colors text-left';
  const activeClasses = 'bg-neutral-800 text-white font-semibold';
  const inactiveClasses = 'text-neutral-300 hover:bg-neutral-800 hover:text-white';

  const className = cn(commonClasses, isActive ? activeClasses : inactiveClasses);

  if (href) {
    return (
      <a href={href} className={className} title={title}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className} title={title}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
};

export const LeftSidebar = ({ width, onGenerateWithAi }: LeftSidebarProps) => {
  const { createNewPrompt, setView } = usePromptStore((state) => state.actions);
  const currentView = usePromptStore((state) => state.currentView);

  const handleNewPrompt = () => {
    const name = prompt('Enter a name for your new prompt:', 'New Prompt');
    if (name && name.trim() !== '') {
      createNewPrompt(name.trim());
    }
  };

  const navItems = [
    { view: 'editor', label: 'Prompt Editor', icon: Edit, title: 'Go to the Prompt Editor' },
    { view: 'templates', label: 'My Prompts', icon: Folder, title: 'Manage your saved prompts' },
    {
      view: 'json-builder',
      label: 'JSON Builder',
      icon: FileJson,
      title: 'Generate structured JSON',
    },
    { view: 'settings', label: 'Settings', icon: Settings, title: 'Configure application settings' },
  ];

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-neutral-900 p-4 border-r border-neutral-800 flex flex-col gap-6 overflow-y-auto flex-shrink-0 h-full"
    >
      <div className="space-y-2">
        <button
          onClick={handleNewPrompt}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold transition-colors"
          title="Create a new blank prompt"
        >
          <PlusCircle className="w-4 h-4" /> New Prompt
        </button>
        <button
          onClick={onGenerateWithAi}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-300 rounded-md text-sm hover:bg-neutral-800 hover:text-white transition-colors"
          title="Create a new prompt using AI"
        >
          <Wand2 className="w-4 h-4" /> New with AI
        </button>
      </div>

      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.view}>
              <NavItem
                label={item.label}
                icon={item.icon}
                isActive={currentView === item.view}
                onClick={() => setView(item.view as any)}
                title={item.title}
              />
            </li>
          ))}
        </ul>
      </nav>


      <div className="flex-grow flex flex-col gap-6">
        <BlockLibrary />
        <ModelConfig />
      </div>
    </aside>
  );
};