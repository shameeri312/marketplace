'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Define the shape of the user profile
interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phoneNo?: string;
  photo?: string;
  city?: string;
  country?: string;
  about?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
}

// Define the context shape
interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (
    data: Partial<UserProfile> & { photo?: File }
  ) => Promise<void>;
}

// Create the context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Profile Provider component
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile from API when authenticated
  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'authenticated' && session?.user?.token) {
        try {
          setIsLoading(true);
          setError(null);

          const response = await axios.get('/api/user', {
            headers: {
              Authorization: `Bearer ${session?.user?.token}`,
            },
          });

          setProfile({
            email: response.data.user.email || '',
            firstName: response.data.user.firstName || '',
            lastName: response.data.user.lastName || '',
            phoneNo: response.data.user.phoneNo || undefined,
            photo: response.data.user.photo || undefined,
            city: response.data.user.city || undefined,
            country: response.data.user.country || undefined,
            about: response.data.user.about || undefined,
            gender: response.data.user.gender || undefined,
            dateOfBirth: response.data.user.dateOfBirth
              ? new Date(response.data.user.dateOfBirth).toISOString()
              : undefined,
          });
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.error ||
            err.message ||
            'Failed to fetch profile';
          setError(errorMessage);
          setProfile(null);
        } finally {
          setIsLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setProfile(null);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session, status]);

  // Function to update the profile
  const updateProfile = async (
    data: Partial<UserProfile> & { photo?: File }
  ) => {
    if (!session?.user?.token) {
      setError('User not authenticated');
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'photo' && value instanceof File) {
            formData.append('photo', value);
          } else if (key === 'dateOfBirth' && value) {
            formData.append(key, new Date(value).toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axios.put('/api/user', formData, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update profile state with response data
      setProfile((prev) => ({
        ...prev,
        ...response.data.user,
        dateOfBirth: response.data.user.dateOfBirth
          ? new Date(response.data.user.dateOfBirth).toISOString()
          : undefined,
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, isLoading, error, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
