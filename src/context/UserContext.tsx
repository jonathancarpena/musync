import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { TimeRange, User } from '../../utils/types';

interface UserContextType {
  user: User | null;
  updateUser: (newUser: User) => void;
  logoutUser: () => void;
  term: TimeRange;
  updateTerm: (value: TimeRange) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [term, setTerm] = useState<TimeRange>('short_term');

  useEffect(() => {
    const cachedUser = localStorage.getItem('spotify_user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('spotify_user', JSON.stringify(newUser));
  };

  const updateTerm = (value: TimeRange) => {
    setTerm(value);
  };
  const logoutUser = () => {
    window.localStorage.removeItem('spotify_user');
    window.localStorage.removeItem('spotify_token');
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, updateUser, logoutUser, term, updateTerm }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
