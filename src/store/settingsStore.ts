import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultModelId } from '../config/models';

interface SettingsState {
  apiKey: string;
  model: string;
  temperature: number;
  topP: number;
  setApiKey: (key: string) => void;
  setModel: (modelId: string) => void;
  setTemperature: (temp: number) => void;
  setTopP: (topP: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      model: defaultModelId,
      temperature: 0.7,
      topP: 0.9,
      setApiKey: (key: string) => set({ apiKey: key }),
      setModel: (modelId: string) => set({ model: modelId }),
      setTemperature: (temp: number) => set({ temperature: temp }),
      setTopP: (topP: number) => set({ topP: topP }),
    }),
    {
      name: 'promptBuilderSettings',
    }
  )
);