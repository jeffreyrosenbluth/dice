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
  coinGameEnabled: boolean;
  coinGameMinFlips: number;
  coinGameMaxFlips: number;
  coinSimEnabled: boolean;
  diceGameEnabled: boolean;
  diceGameMinRolls: number;
  diceGameMaxRolls: number;
  diceSimEnabled: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  coinComplete: false,
  setCoinComplete: () => {},
  diceComplete: false,
  setDiceComplete: () => {},
  coinGameEnabled: true,
  coinGameMinFlips: 20,
  coinGameMaxFlips: 300,
  coinSimEnabled: false,
  diceGameEnabled: false,
  diceGameMinRolls: 20,
  diceGameMaxRolls: 100,
  diceSimEnabled: false,
  loading: true,
  refreshUser: async () => {},
});

export type Config = {
  coin_game_enabled: boolean;
  coin_game_min_flips: number;
  coin_game_max_flips: number;
  coin_sim_enabled: boolean;
  dice_game_enabled: boolean;
  dice_game_min_rolls: number;
  dice_game_max_rolls: number;
  dice_sim_enabled: boolean;
};

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
  const [config, setConfig] = useState<Config | null>(null);

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

  const fetchConfigurations = useCallback(async (): Promise<Config | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("config")
      .select("*")
      .single<Config>();

    if (error) {
      console.error(error);
      return null;
    }
    return data;
  }, [supabase]);

  useEffect(() => {
    const loadConfig = async () => {
      const configData = await fetchConfigurations();
      setConfig(configData);
    };

    loadConfig();
  }, [fetchConfigurations]);

  return (
    <AuthContext.Provider
      value={{
        user,
        coinComplete,
        setCoinComplete,
        diceComplete,
        setDiceComplete,
        coinGameEnabled: config?.coin_game_enabled ?? false,
        coinGameMinFlips: config?.coin_game_min_flips ?? 0,
        coinGameMaxFlips: config?.coin_game_max_flips ?? 0,
        coinSimEnabled: config?.coin_sim_enabled ?? false,
        diceGameEnabled: config?.dice_game_enabled ?? false,
        diceGameMinRolls: config?.dice_game_min_rolls ?? 0,
        diceGameMaxRolls: config?.dice_game_max_rolls ?? 0,
        diceSimEnabled: config?.dice_sim_enabled ?? false,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
