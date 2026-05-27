import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ebblcynqynsjkkygxkxm.supabase.co";
const supabaseAnonKey = "sb_publishable_-2tuXLQwEeS3hvMDoL9OsQ_um7-h8Rf";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
