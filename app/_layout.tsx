// app/_layout.tsx
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-url-polyfill/auto";
import { useAuthStore } from "../stores/useAuthStore";
import "./global.css";

// Composant qui gère les redirections
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { session, isLoading, initialize, cleanup } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // Initialiser l'état d'authentification et nettoyer au démontage
  useEffect(() => {
    initialize();

    // Nettoyer les écouteurs quand le composant est démonté
    return () => {
      cleanup();
    };
  }, []);

  // Gérer les redirections basées sur l'état d'authentification
  useEffect(() => {
    if (isLoading) return;

    // Routes qui nécessitent une authentification
    const protectedRoutes = ["/home", "/(tab)/home", "/profile", "/settings"];

    // Routes accessibles seulement si non authentifié
    const publicOnlyRoutes = ["/", "/login", "/signup"];

    // Vérifier si la route actuelle est protégée
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Vérifier si la route actuelle est reservée aux utilisateurs non connectés
    const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

    console.log("Pathname:", pathname);
    console.log("Is protected:", isProtectedRoute);
    console.log("Is public only:", isPublicOnlyRoute);

    if (!session && isProtectedRoute) {
      // Rediriger vers la page de connexion
      router.replace("/");
    } else if (session && isPublicOnlyRoute) {
      // Rediriger vers la page d'accueil
      router.replace("/home");
    }
  }, [session, pathname, isLoading]);

  if (isLoading) {
    // Afficher un écran de chargement
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return <>{children}</>;
}

// Composant racine
export default function RootLayout() {
  return (
    <AuthRedirect>
      <Stack
        screenOptions={{
          headerShown: false, // Masquer l'en-tête
        }}
      >
        {/* Définir les routes et les pages du tab ici */}
        <Stack.Screen name="home" />
      </Stack>
    </AuthRedirect>
  );
}
