import { useState, useEffect } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { formatBytes } from '../../utils';
import { HardDrive, FileText } from 'lucide-react';

const STORAGE_KEY = 'promptBuilderState';

export const StorageStats = () => {
  const promptCount = usePromptStore((state) => state.prompts.length);
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    const calculateStorage = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const size = new Blob([storedData]).size;
          setStorageSize(size);
        } else {
          setStorageSize(0);
        }
      } catch (e) {
        console.error('Could not calculate storage size:', e);
        setStorageSize(0);
      }
    };

    calculateStorage();

    const unsubscribe = usePromptStore.subscribe(calculateStorage);
    window.addEventListener('storage', calculateStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', calculateStorage);
    };
  }, []);

  return (
    <div className="mx-auto max-w-[333px] mt-20">
      <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3 px-2">
        Stats
      </h2>
      <div className="space-y-2 text-sm text-neutral-300 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileText className="w-4 h-4" />
            <span>Total Prompts</span>
          </div>
          <span className="font-semibold text-white">{promptCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <HardDrive className="w-4 h-4" />
            <span>Storage Used</span>
          </div>
          <span className="font-semibold text-white">{formatBytes(storageSize)}</span>
        </div>
      </div>
    </div>
  );
};