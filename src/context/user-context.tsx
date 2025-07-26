
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { mockUser } from '@/lib/mock-data';

interface UserContextType {
  user: User;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    if (typeof window === 'undefined') {
      return mockUser;
    }
    try {
      const item = window.localStorage.getItem('newsblendUser');
      return item ? JSON.parse(item) : mockUser;
    } catch (error) {
      console.error(error);
      return mockUser;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('newsblendUser', JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
