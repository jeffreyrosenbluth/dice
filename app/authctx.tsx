"use client";
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { User, SupabaseClient } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  coinComplete: boolean;
  setCoinComplete: (value: boolean) => void;
  diceComplete: boolean;
  setDiceComplete: (value: boolean) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
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

function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const refreshUser = useCallback(async () => {
    if (!supabase) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }, [supabase]);

  return { user, loading, supabase, refreshUser };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, supabase, refreshUser } = useSupabaseAuth();
  const [coinComplete, setCoinComplete] = useState(false);
  const [diceComplete, setDiceComplete] = useState(false);

  const fetchUserData = useCallback(
    async (user: User) => {
      if (!supabase) return;
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

  useEffect(() => {
    if (user) {
      fetchUserData(user);
    } else {
      setCoinComplete(false);
      setDiceComplete(false);
    }
  }, [user, fetchUserData]);

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
