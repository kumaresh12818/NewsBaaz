
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { onAuthStateChanged, updateProfile, updateEmail } from 'firebase/auth';

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        setUser({
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          avatarUrl: currentUser.photoURL || `https://placehold.co/100x100.png?text=${(currentUser.displayName || 'U').charAt(0)}`,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const updateUser = async (updates: Partial<User>) => {
    if (firebaseUser) {
      const profileUpdates: { displayName?: string; photoURL?: string } = {};
      if (updates.name) profileUpdates.displayName = updates.name;
      if (updates.avatarUrl) profileUpdates.photoURL = updates.avatarUrl;

      if(Object.keys(profileUpdates).length > 0) {
        await updateProfile(firebaseUser, profileUpdates);
      }

      if (updates.email && updates.email !== firebaseUser.email) {
        await updateEmail(firebaseUser, updates.email);
      }

      // Refresh user state
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        setFirebaseUser(updatedUser);
        setUser({
          name: updatedUser.displayName || 'User',
          email: updatedUser.email || '',
          avatarUrl: updatedUser.photoURL || `https://placehold.co/100x100.png?text=${(updatedUser.displayName || 'U').charAt(0)}`,
        });
      }
    }
  };


  return (
    <UserContext.Provider value={{ user, firebaseUser, loading, updateUser }}>
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
