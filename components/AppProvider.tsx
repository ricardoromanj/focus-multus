'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  setCurrentUserId: (userId: string) => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch all users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          if (data.length > 0 && !currentUserId) {
            setCurrentUserId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    }
    fetchUsers();
  }, []);

  // Update current user when userId changes
  useEffect(() => {
    if (currentUserId && users.length > 0) {
      const user = users.find(u => u.id === currentUserId);
      setCurrentUser(user || null);
    }
  }, [currentUserId, users]);

  // Refresh current user data
  const refreshUser = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await fetch(`/api/users/${currentUserId}`);
      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUserId ? updatedUser : u));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AppContext.Provider value={{ currentUser, users, setCurrentUserId, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

