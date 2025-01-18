import { create } from 'zustand';
import { storage, type StorageData } from './storage';

interface ExtensionState {
  isLoading: boolean;
  pageTitle: string | null;
  activeTab: string;
  settings: StorageData['settings'];
  setLoading: (loading: boolean) => void;
  setPageTitle: (title: string) => void;
  setActiveTab: (tab: string) => void;
  setSettings: (settings: StorageData['settings']) => void;
  initializeFromStorage: () => Promise<void>;
}

export const useStore = create<ExtensionState>((set) => ({
  isLoading: false,
  pageTitle: null,
  activeTab: 'general',
  settings: {
    theme: 'light',
    notifications: true,
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setPageTitle: (title) => set({ pageTitle: title }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSettings: (settings) => {
    set({ settings });
    // Persist to chrome storage
    storage.set('settings', settings);
  },
  
  initializeFromStorage: async () => {
    const settings = await storage.get('settings');
    if (settings) {
      set({ settings });
    }
  },
}));
