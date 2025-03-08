import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)"]}
            style={styles.gradient}
          />
          <View style={styles.iconContainer}>
            <MaterialIcons name="bookmark" size={28} color="#6366f1" />
          </View>
          <Text style={styles.title}>Premium Card</Text>
          <Text style={styles.subtitle}>Interactive 3D Effect</Text>
          <Text style={styles.description}>
            Press this card to experience a smooth animation that creates an
            immersive 3D effect through careful shadows and scaling.
          </Text>
          <View style={styles.footer}>
            <MaterialIcons name="touch-app" size={20} color="#6366f1" />
            <Text style={styles.footerText}>Press to interact</Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7ff",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderRadius: 24,
  },
  iconContainer: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    padding: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(99, 102, 241, 0.1)",
    paddingTop: 16,
  },
  footerText: {
    marginLeft: 8,
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "500",
  },
});
