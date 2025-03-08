// stores/useAuthStore.ts
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "../lib/supabase";

interface AuthState {
  // État
  session: Session | null;
  user: User | null;
  isLoading: boolean;

  // Actions publiques
  initialize: () => Promise<void>;
  cleanup: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Variables privées pour le store
  let authListener: any = null;

  return {
    // État initial
    session: null,
    user: null,
    isLoading: false,

    // Initialisation
    initialize: async () => {
      if (typeof window === "undefined") return;

      try {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        set({
          session: data.session,
          user: data.session?.user ?? null,
        });

        // Configurer l'écouteur
        authListener = supabase.auth.onAuthStateChange((_event, session) => {
          set({
            session,
            user: session?.user ?? null,
          });
        });
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    // Nettoyage
    cleanup: () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
        authListener = null;
      }
    },

    // Connexion
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

    // Inscription
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

    // Déconnexion
    signOut: async () => {
      set({ isLoading: true });
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return true;
      } catch (error: any) {
        console.error("Erreur de déconnexion:", error.message);
        return false;
      } finally {
        set({ isLoading: false });
      }
    },

    // Rafraîchir la session
    refreshSession: async () => {
      set({ isLoading: true });
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        set({
          session: data.session,
          user: data.session?.user ?? null,
        });
      } catch (error) {
        console.error("Erreur de rafraîchissement:", error);
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
