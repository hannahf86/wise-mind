import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import * as Linking from "expo-linking";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Handle deep links — when user taps magic link in email
    const handleDeepLink = async (url: string) => {
      if (url.includes("token_hash")) {
        const params = new URLSearchParams(url.split("?")[1]);
        const tokenHash = params.get("token_hash");
        const type = params.get("type") as any;
        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          });
          if (error) console.log("Deep link auth error:", error.message);
        }
      }
    };

    // Check if app was opened from a link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for links while app is open
    const linkSub = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.unsubscribe();
      linkSub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
