"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  coinComplete: boolean;
  setCoinComplete: (value: boolean) => void;
  diceComplete: boolean;
  setDiceComplete: (value: boolean) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  coinComplete: false,
  setCoinComplete: () => {},
  diceComplete: false,
  setDiceComplete: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const [coinComplete, setCoinComplete] = useState(false);
  const [diceComplete, setDiceComplete] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("coin_complete, dice_complete")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setCoinComplete(data.coin_complete);
          setDiceComplete(data.dice_complete);
        }
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        coinComplete,
        setCoinComplete,
        diceComplete,
        setDiceComplete,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
