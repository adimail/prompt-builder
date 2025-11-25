import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Sidebar = 'left' | 'right';

interface UiState {
  fontSize: number;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  actions: {
    setFontSize: (size: number) => void;
    toggleSidebar: (sidebar: Sidebar) => void;
    closeSidebars: () => void;
  };
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      fontSize: 14,
      isLeftSidebarOpen: false,
      isRightSidebarOpen: false,
      actions: {
        setFontSize: (size) => set({ fontSize: size }),
        toggleSidebar: (sidebar) => {
          if (sidebar === 'left') {
            set((state) => ({
              isLeftSidebarOpen: !state.isLeftSidebarOpen,
              isRightSidebarOpen: false,
            }));
          } else {
            set((state) => ({
              isRightSidebarOpen: !state.isRightSidebarOpen,
              isLeftSidebarOpen: false,
            }));
          }
        },
        closeSidebars: () => set({ isLeftSidebarOpen: false, isRightSidebarOpen: false }),
      },
    }),
    {
      name: 'promptBuilderUIState',
      partialize: (state) => ({
        fontSize: state.fontSize,
      }),
    }
  )
);
