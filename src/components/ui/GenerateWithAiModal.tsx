import { useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { useSettingsStore } from '../../store/settingsStore';
import { generatePromptFromScratch } from '../../services/geminiService';
import { Prompt } from '../../types';
import { Loader, Wand2, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateId, cleanJsonString } from '../../utils';

interface GenerateWithAiModalProps {
  onClose: () => void;
}

const validatePromptData = (data: any): boolean => {
  return (
    data &&
    typeof data.name === 'string' &&
    Array.isArray(data.blocks) &&
    data.blocks.every(
      (b: any) => b && typeof b.type === 'string' && typeof b.content === 'string'
    )
  );
};

export const GenerateWithAiModal = ({ onClose }: GenerateWithAiModalProps) => {
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiKey, model } = useSettingsStore();
  const { loadGeneratedPrompt, setView } = usePromptStore((state) => state.actions);

  const handleSubmit = async () => {
    if (!requirements.trim()) {
      setError('Please describe the prompt you want to create.');
      return;
    }
    if (!apiKey) {
      alert('Please set your Gemini API key in the Settings page to use this feature.');
      setView('settings');
      onClose();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const jsonString = await generatePromptFromScratch(apiKey, model, requirements);
      const cleanedString = cleanJsonString(jsonString);
      const generatedData = JSON.parse(cleanedString);

      if (!validatePromptData(generatedData)) {
        throw new Error('The AI returned data in an invalid format. Please try again.');
      }

      const finalPrompt: Prompt = {
        id: generateId(),
        name: generatedData.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        format: 'blocks',
        content: '',
        blocks: generatedData.blocks.map((block: any) => ({
          id: generateId(),
          type: block.type,
          content: block.content,
          isCollapsed: false,
        })),
      };

      loadGeneratedPrompt(finalPrompt);
      onClose();
    } catch (err) {
      console.error('Failed to generate prompt with AI:', err);
      let errorMessage = 'An unexpected error occurred. Please check the console for details.';
      if (err instanceof SyntaxError) {
        errorMessage = 'The AI returned data in an invalid JSON format. Please try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl w-full max-w-2xl text-white font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <h2 className="text-xl font-bold tracking-wider flex items-center gap-2">
              <Wand2 className="text-orange-500" />
              New Prompt with AI
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-neutral-400 font-sans">
              Describe the prompt you want to create. The AI will generate a complete prompt
              structure for you.
            </p>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
              rows={6}
              placeholder="e.g., A prompt to generate a professional resignation email..."
              disabled={isLoading}
            />
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-md text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end p-4 bg-neutral-950/50 border-t border-neutral-800 rounded-b-lg">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !requirements.trim()}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed w-36"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};