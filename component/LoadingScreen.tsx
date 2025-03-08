// components/LoadingScreen.tsx
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({
  message = "Chargement en cours...",
}: LoadingScreenProps) {
  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Image
        source={require("../assets/images/logo.jpg")}
        className="w-24 h-24 mb-6"
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#0891b2" className="mb-4" />
      <Text className="text-gray-600 text-center text-base">{message}</Text>
    </View>
  );
}
