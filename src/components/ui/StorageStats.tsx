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
    <div className="mx-auto mt-20 max-w-[333px]">
      <h2 className="mb-3 px-2 text-sm font-medium uppercase tracking-wider text-neutral-400">
        Stats
      </h2>
      <div className="space-y-2 px-2 text-sm text-neutral-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <FileText className="h-4 w-4" />
            <span>Total Prompts</span>
          </div>
          <span className="font-semibold text-white">{promptCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <HardDrive className="h-4 w-4" />
            <span>Storage Used</span>
          </div>
          <span className="font-semibold text-white">{formatBytes(storageSize)}</span>
        </div>
      </div>
    </div>
  );
};
