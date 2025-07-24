import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultModelId } from '../config/models';

interface SettingsState {
  apiKey: string;
  model: string;
  setApiKey: (key: string) => void;
  setModel: (modelId: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      model: defaultModelId,
      setApiKey: (key: string) => set({ apiKey: key }),
      setModel: (modelId: string) => set({ model: modelId }),
    }),
    {
      name: 'promptBuilderSettings',
    }
  )
);