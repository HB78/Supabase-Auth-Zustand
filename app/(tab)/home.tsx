import Card from "@/component/Card";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, Text } from "react-native";

const home = () => {
  const { user, session } = useAuthStore();

  return (
    <SafeAreaView className="h-full p-5">
      <Text>
        {session ? JSON.stringify(user?.email) : "Pas de session disponible"}
      </Text>
      <Link href={"/(tab)/homeScreen"}>signup</Link>
      <Card />
    </SafeAreaView>
  );
};

export default home;
