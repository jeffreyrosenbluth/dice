import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export function useSupabase(): SupabaseClient {
  const [supabase] = useState(() => createClient());
  return supabase;
}
