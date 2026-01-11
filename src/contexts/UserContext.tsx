import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'lifafa' | 'reward' | 'task';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  date: string;
}

export interface User {
  id: string;
  mobile: string;
  name: string;
  avatar: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  transactions: Transaction[];
  lifafaHistory: {
    id: string;
    type: 'created' | 'claimed';
    amount: number;
    code: string;
    date: string;
  }[];
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  signup: (mobile: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const dummyTransactions: Transaction[] = [
  { id: '1', type: 'reward', amount: 50, status: 'completed', description: 'Daily Login Bonus', date: '2026-01-11' },
  { id: '2', type: 'task', amount: 25, status: 'completed', description: 'Telegram Task Completed', date: '2026-01-10' },
  { id: '3', type: 'lifafa', amount: 100, status: 'completed', description: 'Claimed Lifafa Gift', date: '2026-01-09' },
  { id: '4', type: 'withdraw', amount: -200, status: 'completed', description: 'UPI Withdrawal', date: '2026-01-08' },
  { id: '5', type: 'deposit', amount: 500, status: 'completed', description: 'Wallet Recharge', date: '2026-01-07' },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mobile && password) {
      setUser({
        id: 'USR' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        mobile,
        name: 'User',
        avatar: '',
        balance: 1250,
        totalEarned: 5680,
        totalWithdrawn: 4430,
        transactions: dummyTransactions,
        lifafaHistory: [
          { id: '1', type: 'claimed', amount: 100, code: 'GIFT2026', date: '2026-01-09' },
          { id: '2', type: 'created', amount: 200, code: 'MYLIFAFA', date: '2026-01-05' },
        ],
      });
      return true;
    }
    return false;
  };

  const signup = async (mobile: string, password: string, name: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mobile && password && name) {
      setUser({
        id: 'USR' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        mobile,
        name,
        avatar: '',
        balance: 100, // Welcome bonus
        totalEarned: 100,
        totalWithdrawn: 0,
        transactions: [
          { id: '1', type: 'reward', amount: 100, status: 'completed', description: 'Welcome Bonus! 🎉', date: new Date().toISOString().split('T')[0] },
        ],
        lifafaHistory: [],
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (user) {
      const newTransaction: Transaction = {
        ...transaction,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
      };
      setUser({
        ...user,
        transactions: [newTransaction, ...user.transactions],
        balance: user.balance + transaction.amount,
      });
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateBalance,
      addTransaction,
    }}>
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