import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudentProfile, MatchResult } from '../types';
import { universities } from '../data/mockData';
import { calculateMatches } from '../utils/matchingAlgorithm';

interface ProfileContextType {
  profile: StudentProfile | null;
  setProfile: (profile: StudentProfile) => void;
  matches: MatchResult[];
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('studentProfile');
    return saved ? JSON.parse(saved) : null;
  });

  const [matches, setMatches] = useState<MatchResult[]>([]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('studentProfile', JSON.stringify(profile));
      const calculatedMatches = calculateMatches(profile, universities);
      setMatches(calculatedMatches);
    } else {
      localStorage.removeItem('studentProfile');
      setMatches([]);
    }
  }, [profile]);

  const setProfile = (newProfile: StudentProfile) => {
    setProfileState(newProfile);
  };

  const clearProfile = () => {
    setProfileState(null);
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, matches, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
