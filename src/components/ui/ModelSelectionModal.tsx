import { useSettingsStore } from '../../store/settingsStore';
import { availableModels, GeminiModel } from '../../config/models';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ModelSelectionModalProps {
  onClose: () => void;
}

const ModelCard = ({
  model,
  isSelected,
  onSelect,
}: {
  model: GeminiModel;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <div
    onClick={onSelect}
    className={cn(
      'relative cursor-pointer rounded-lg border p-4 transition-all',
      isSelected
        ? 'border-orange-500 bg-orange-900/30'
        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
    )}
  >
    {isSelected && <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-orange-500" />}
    <h3 className="pr-6 font-bold tracking-wider text-white">{model.name}</h3>
    <p className="mt-2 font-sans text-sm text-neutral-400">{model.description}</p>
  </div>
);

export const ModelSelectionModal = ({ onClose }: ModelSelectionModalProps) => {
  const { model: selectedModelId, setModel } = useSettingsStore();

  const handleSelectModel = (modelId: string) => {
    setModel(modelId);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-neutral-800 bg-neutral-900 font-mono text-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-800 p-4">
            <h2 className="text-xl font-bold tracking-wider">Select a Model</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto p-6">
            {availableModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModelId === model.id}
                onSelect={() => handleSelectModel(model.id)}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
