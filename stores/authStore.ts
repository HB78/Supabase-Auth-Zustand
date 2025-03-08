// stores/useAuthStore.ts
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface AuthState {
  // État
  session: Session | null;
  user: User | null;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  cleanup: () => void;

  // Ces actions remplaceront vos fonctions onSignIn et onSignUp
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: false,

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Récupérer la session actuelle
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      set({
        session: data.session,
        user: data.session?.user || null,
      });

      // Configurer l'écouteur pour les changements d'état d'authentification
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          set({
            session,
            user: session?.user || null,
          });
        }
      );

      // @ts-ignore - Stocker l'écouteur pour le nettoyage plus tard
      get()._authListener = authListener;
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  cleanup: () => {
    // @ts-ignore
    const authListener = get()._authListener;
    if (authListener?.subscription) {
      authListener.subscription.unsubscribe();
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Erreur de connexion:", error.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Erreur d'inscription:", error.message);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
