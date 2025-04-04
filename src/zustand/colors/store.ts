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
        chatColor: '#ff0000', // Darker bright red as default

        setChatColor: (color: string) => set({ chatColor: color }),

        colorOptions: ['#ff0000', '#2ECC71', '#3498DB', '#ff6700', '#F1C40F'],
      }),
      {
        name: 'chat-color-storage', // Name of the item in localStorage
        storage: createJSONStorage(() => localStorage), // Default storage is localStorage
      }
    )
  )
);

export default useChatColorStore;
