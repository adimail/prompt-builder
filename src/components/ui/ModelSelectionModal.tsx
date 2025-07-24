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
      'p-4 rounded-lg border cursor-pointer transition-all relative',
      isSelected
        ? 'border-orange-500 bg-orange-900/30'
        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
    )}
  >
    {isSelected && <CheckCircle className="w-5 h-5 text-orange-500 absolute top-3 right-3" />}
    <h3 className="font-bold text-white tracking-wider pr-6">{model.name}</h3>
    <p className="text-sm text-neutral-400 font-sans mt-2">{model.description}</p>
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
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl w-full max-w-3xl text-white font-mono flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-800 flex-shrink-0">
            <h2 className="text-xl font-bold tracking-wider">Select a Model</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-800 hover:text-white"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
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