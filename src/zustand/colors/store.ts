import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';

// Define the color store interface
interface ColorState {
  chatColor: string;
  setChatColor: (color: string) => void;
  colorOptions: string[];
}

// Create the Zustand store with persistence
const useChatColorStore = create<ColorState>()(
  devtools(
    persist(
      (set) => ({
        chatColor: '#c1121f', // Darker bright red as default

        setChatColor: (color: string) => set({ chatColor: color }),

        colorOptions: ['#c1121f', '#086c19', '#00509d', '#f95738', '#f7b538'],
      }),
      {
        name: 'chat-color-storage', // Name of the item in localStorage
        storage: createJSONStorage(() => localStorage), // Default storage is localStorage
      }
    )
  )
);

export default useChatColorStore;
