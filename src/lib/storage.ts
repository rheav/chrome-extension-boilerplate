import { z } from 'zod';

// Define types for stored data
export const StorageSchema = z.object({
  settings: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }),
  userData: z.object({
    lastVisited: z.string().optional(),
    favorites: z.array(z.string()),
  }),
});

export type StorageData = z.infer<typeof StorageSchema>;

// Type-safe storage utilities
export const storage = {
  async get<T extends keyof StorageData>(key: T): Promise<StorageData[T]> {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },

  async set<T extends keyof StorageData>(
    key: T,
    value: StorageData[T]
  ): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },

  async getAll(): Promise<Partial<StorageData>> {
    return await chrome.storage.local.get(null);
  },

  onChange(callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void) {
    chrome.storage.local.onChanged.addListener(callback);
  },
};
