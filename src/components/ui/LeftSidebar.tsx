import { useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { useSettingsStore } from '../../store/settingsStore';
import { BlockLibrary } from '../editor/BlockLibrary';
import { ModelConfig } from '../editor/ModelConfig';
import { streamPromptGeneration } from '../../services/geminiService';
import { generateId } from '../../utils';
import { BlockType, blockTypes } from '../../types';
import { 
  PlusCircle, 
  Folder, 
  Settings, 
  Wand2, 
  FileJson, 
  Edit, 
  Repeat, 
  X, 
  Loader, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { cn } from '../../utils/cn';

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


const parseBlocksFromText = (text: string): { name: string | null; blocks: { type: BlockType; content: string }[] } => {
  const blocks: { type: BlockType; content: string }[] = [];
  let name: string | null = null;
  
  
  const regex = /(?:^|\n)===\s*\n?~~\s*([a-zA-Z]+)\s*\n?===\s*\n?/g;
  
  let match;
  let lastIndex = 0;
  let currentType: string | null = null;

  while ((match = regex.exec(text)) !== null) {
    
    if (currentType) {
      const content = text.substring(lastIndex, match.index).trim();
      if (currentType === 'NAME') {
        name = content;
      } else {
        
        const type = blockTypes.includes(currentType as any) ? (currentType as BlockType) : 'Instruction';
        blocks.push({ type, content });
      }
    }

    
    currentType = match[1];
    lastIndex = regex.lastIndex;
  }

  
  if (currentType) {
    const content = text.substring(lastIndex).trim();
    if (currentType === 'NAME') {
      name = content;
    } else {
      const type = blockTypes.includes(currentType as any) ? (currentType as BlockType) : 'Instruction';
      blocks.push({ type, content });
    }
  }

  return { name, blocks };
};

export const LeftSidebar = ({ width, onGenerateWithAi }: LeftSidebarProps) => {
  const { createNewPrompt, setView, setBlocks: setStoreBlocks, updateCurrentPromptName } = usePromptStore((state) => state.actions);
  const currentView = usePromptStore((state) => state.currentView);
  const { apiKey, model, temperature, topP } = useSettingsStore();

  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewPrompt = () => {
    const name = prompt('Enter a name for your new prompt:', 'New Prompt');
    if (name && name.trim() !== '') {
      createNewPrompt(name.trim());
    }
  };

  const handleCloseAiMode = () => {
    setRequirements('');
    setError(null);
    setView('editor');
  };

  const handleSubmitAi = async () => {
    if (!requirements.trim()) {
      setError('Please describe the prompt you want to create.');
      return;
    }
    if (!apiKey) {
      alert('Please set your Gemini API key in the Settings page to use this feature.');
      setView('settings');
      return;
    }

    setIsLoading(true);
    setError(null);

    
    createNewPrompt('Generating...');
    
    
    const promptId = usePromptStore.getState().currentPromptId;
    if (!promptId) return;

    
    setView('editor');

    
    let accumulatedText = '';
    const existingBlockIds: string[] = []; 

    try {
      await streamPromptGeneration(
        apiKey,
        model,
        temperature,
        topP,
        requirements,
        (chunk) => {
          accumulatedText += chunk;
          const { name, blocks: parsedBlocks } = parseBlocksFromText(accumulatedText);

          
          if (name) {
            updateCurrentPromptName(name);
          }

          const newBlocks = parsedBlocks.map((pb, index) => {
            if (index >= existingBlockIds.length) {
              existingBlockIds.push(generateId());
            }
            return {
              id: existingBlockIds[index],
              type: pb.type,
              content: pb.content,
              isCollapsed: false
            };
          });

          setStoreBlocks(promptId, newBlocks);
        }
      );
      
      setRequirements('');
    } catch (err) {
      console.error('Failed to generate prompt with AI:', err);
      let errorMessage = 'An unexpected error occurred. Please check the console for details.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      alert(`Generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
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
    {
      view: 'paraphrase',
      label: 'Paraphrase',
      icon: Repeat,
      title: 'Paraphrase your text',
    },
    { view: 'settings', label: 'Settings', icon: Settings, title: 'Configure application settings' },
  ];

  if (currentView === 'ai-create') {
    return (
      <aside
        style={{ width: `${width}px` }}
        className="bg-neutral-900 p-4 border-r border-neutral-800 flex flex-col gap-4 overflow-y-auto flex-shrink-0 h-full"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-white tracking-wider flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-orange-500" />
            AI CREATOR
          </h3>
          <button
            onClick={handleCloseAiMode}
            className="text-neutral-400 hover:text-white transition-colors"
            title="Close AI Creator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <p className="text-sm text-neutral-400 font-sans">
            Describe the prompt you want to build. The AI will generate the structure for you.
          </p>
          
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmitAi();
              }
            }}
            className="w-full flex-1 p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono resize-none text-sm"
            placeholder="e.g., Create a prompt for a customer support agent handling a refund request..."
            disabled={isLoading}
          />

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-md text-xs flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmitAi}
            disabled={isLoading || !requirements.trim()}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </aside>
    );
  }

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
        {currentView === 'editor' && <BlockLibrary />}
        <ModelConfig />
      </div>
    </aside>
  );
};