import {
  LoginFormData,
  loginSchema,
  SignupFormData,
  signupSchema,
} from "@/schemas/schema";
import { useAuthStore } from "@/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, isLoading } = useAuthStore();

  // Animation pour le changement de mode
  const [fadeAnim] = useState(new Animated.Value(1));

  // Configuration de React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(isSignUp ? signupSchema : loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const animateTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleMode = () => {
    animateTransition();
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      reset(); // Réinitialise le formulaire lors du changement de mode
    }, 150);
  };
  // Nouvelles fonctions qui utilisent le store
  const onSignIn = async (data: LoginFormData) => {
    const success = await signIn(data.email, data.password);
    if (!success) {
      Alert.alert(
        "Erreur de connexion",
        "Vérifiez vos identifiants et réessayez."
      );
      return;
    }
    router.push("./home");
  };

  const onSignUp = async (data: SignupFormData) => {
    const success = await signUp(data.email, data.password);
    if (success) {
      Alert.alert("Votre compte a bien été crée ! Bienvenue !");
      setIsSignUp(false);
      reset();
    } else {
      Alert.alert(
        "Erreur d'inscription",
        "Impossible de créer votre compte. Veuillez réessayer."
      );
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center p-5"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <BlurView
            intensity={80}
            className="rounded-3xl p-9 bg-white/80 shadow-md"
          >
            <View className="items-center mb-8">
              <Image
                source={require("../assets/images/logo.jpg")}
                className="w-10 h-10 mb-4"
                resizeMode="contain"
                accessible={true}
                accessibilityLabel="Logo de l'application"
              />
              <Text className="text-2xl font-bold mb-2 text-gray-800">
                {isSignUp ? "Créer un compte" : "Bienvenue !"}
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                {isSignUp
                  ? "Remplissez vos informations pour commencer"
                  : "Connectez-vous pour continuer"}
              </Text>
            </View>

            <View className="mb-5">
              {/* Champ Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View className="flex-row items-center bg-gray-100 rounded-xl mb-1 px-3 border border-gray-200">
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#666"
                        className="mr-2"
                      />
                      <TextInput
                        className="flex-1 h-12 text-gray-800 text-base"
                        placeholder="Email"
                        placeholderTextColor="#888"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        accessible={true}
                        accessibilityLabel="Champ email"
                      />
                    </View>
                    {errors.email && (
                      <Text className="text-red-500 text-xs ml-2 mb-3">
                        {errors.email.message}
                      </Text>
                    )}
                  </>
                )}
              />

              {/* Champ Mot de passe */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View className="flex-row items-center bg-gray-100 rounded-xl mb-1 px-3 border border-gray-200">
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#666"
                        className="mr-2"
                      />
                      <TextInput
                        className="flex-1 h-12 text-gray-800 text-base pr-10"
                        placeholder="Mot de passe"
                        placeholderTextColor="#888"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        accessible={true}
                        accessibilityLabel="Champ mot de passe"
                      />
                      <TouchableOpacity
                        className="absolute right-3"
                        onPress={() => setShowPassword(!showPassword)}
                        accessible={true}
                        accessibilityLabel={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password ? (
                      <Text className="text-red-500 text-xs ml-2 mb-3">
                        {errors.password.message}
                      </Text>
                    ) : isSignUp ? (
                      <Text className="text-gray-500 text-xs ml-2 mb-3">
                        Le mot de passe doit contenir au moins 8 caractères, une
                        minuscule, une majuscule et un chiffre
                      </Text>
                    ) : null}
                  </>
                )}
              />

              {!isSignUp && (
                <TouchableOpacity
                  className="items-end mt-1"
                  accessible={true}
                  accessibilityLabel="Mot de passe oublié"
                >
                  <Text className="text-blue-600 text-sm">
                    Mot de passe oublié ?
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              className={`h-12 rounded-xl items-center justify-center mb-5 ${
                isLoading ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleSubmit(
                isSignUp ? (onSignUp as any) : (onSignIn as any)
              )}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel={
                isSignUp ? "Bouton d'inscription" : "Bouton de connexion"
              }
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  {isSignUp ? "S'inscrire" : "Se connecter"}
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-sm">
                {isSignUp
                  ? "Vous avez déjà un compte ? "
                  : "Vous n'avez pas de compte ? "}
              </Text>
              <TouchableOpacity
                onPress={toggleMode}
                accessible={true}
                accessibilityLabel={
                  isSignUp ? "Passer à la connexion" : "Passer à l'inscription"
                }
              >
                <Text className="text-blue-600 text-sm font-bold">
                  {isSignUp ? "Se connecter" : "S'inscrire"}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
