"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  coinComplete: boolean;
  setCoinComplete: (value: boolean) => void;
  diceComplete: boolean;
  setDiceComplete: (value: boolean) => void;
  loading: boolean;
  refreshUser: () => Promise<void>; // Add this method
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  coinComplete: false,
  setCoinComplete: () => {},
  diceComplete: false,
  setDiceComplete: () => {},
  loading: true,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [coinComplete, setCoinComplete] = useState(false);
  const [diceComplete, setDiceComplete] = useState(false);

  const fetchUserData = useCallback(
    async (user: User) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("coin_complete, dice_complete")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setCoinComplete(data.coin_complete);
        setDiceComplete(data.dice_complete);
      }
    },
    [supabase]
  );

  const refreshUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await fetchUserData(user);
    }
    setLoading(false);
  }, [supabase, fetchUserData]);

  useEffect(() => {
    refreshUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserData(session.user);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, fetchUserData, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        coinComplete,
        setCoinComplete,
        diceComplete,
        setDiceComplete,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
