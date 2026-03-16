import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type SubscriptionPlan = 'free' | 'premium_once' | 'subscription';

interface SubscriptionState {
  plan: SubscriptionPlan;
  expiresAt: string | null; // ISO date — for subscription plan
  activatedAt: string | null; // ISO date
}

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isPremium: boolean;
  isSubscription: boolean;
  expiresAt: Date | null;
  daysLeft: number | null;
  activatePremiumOnce: () => void;
  activateSubscription: (months?: number) => void;
  cancelSubscription: () => void;
}

const STORAGE_KEY = 'subscriptionState';

const defaultState: SubscriptionState = {
  plan: 'free',
  expiresAt: null,
  activatedAt: null,
};

function loadFromStorage(): SubscriptionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed: SubscriptionState = JSON.parse(raw);
    // If subscription expired — downgrade to free
    if (parsed.plan === 'subscription' && parsed.expiresAt) {
      const expiry = new Date(parsed.expiresAt);
      if (expiry < new Date()) {
        return { ...defaultState };
      }
    }
    return parsed;
  } catch {
    return defaultState;
  }
}

function saveToStorage(state: SubscriptionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Keep legacy key in sync for Results/Strategy pages that read it directly
  localStorage.setItem('isPremium', state.plan !== 'free' ? 'true' : 'false');
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const isPremium = state.plan === 'premium_once' || state.plan === 'subscription';
  const isSubscription = state.plan === 'subscription';

  const expiresAt = state.expiresAt ? new Date(state.expiresAt) : null;
  const daysLeft =
    expiresAt
      ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

  const activatePremiumOnce = useCallback(() => {
    const now = new Date().toISOString();
    setState({ plan: 'premium_once', expiresAt: null, activatedAt: now });
  }, []);

  const activateSubscription = useCallback((months = 1) => {
    const now = new Date();
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + months);
    setState({
      plan: 'subscription',
      expiresAt: expiry.toISOString(),
      activatedAt: now.toISOString(),
    });
  }, []);

  const cancelSubscription = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem('isPremium', 'false');
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        plan: state.plan,
        isPremium,
        isSubscription,
        expiresAt,
        daysLeft,
        activatePremiumOnce,
        activateSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
