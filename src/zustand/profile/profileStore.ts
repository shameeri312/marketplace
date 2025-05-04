import { create } from 'zustand';

// Define the UserProfile interface based on the Mongoose schema
interface UserProfile {
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  phoneNo?: string;
  photo?: string;
  city?: string;
  country?: string;
  about?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string; // Using string for easier handling in frontend
  role: 'admin' | 'user';
  isActive: boolean;
  isStaff: boolean;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the store interface
interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

// Create the Zustand store
export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile: UserProfile) => set({ profile }),
  updateProfile: (updates: Partial<UserProfile>) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
  clearProfile: () => set({ profile: null }),
}));
