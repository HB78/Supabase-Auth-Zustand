import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const cards = [
  {
    id: "1",
    title: "Cosmic Explorer",
    description: "Journey through the stars and discover new worlds",
    colors: ["#FF61D2", "#FE9090"] as [string, string],
  },
  {
    id: "2",
    title: "Ocean Dreams",
    description: "Dive deep into the mysteries of the sea",
    colors: ["#4CB8C4", "#3CD3AD"] as [string, string],
  },
  {
    id: "3",
    title: "Mountain Peak",
    description: "Reach new heights and conquer your fears",
    colors: ["#6441A5", "#2a0845"] as [string, string],
  },
  {
    id: "4",
    title: "Mountain Peak",
    description: "Reach new heights and conquer your fears",
    colors: ["#644455", "#2a0845"] as [string, string],
  },
];

export default function Card3DCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { dx }) => {
      animation.setValue(dx);
    },
    onPanResponderRelease: (_, { dx }) => {
      if (Math.abs(dx) > 120) {
        const newIndex =
          dx > 0
            ? Math.max(currentIndex - 1, 0)
            : Math.min(currentIndex + 1, cards.length - 1);

        setCurrentIndex(newIndex);
      }

      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.carousel}>
        {cards.map((card, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const translateX = animation.interpolate({
            inputRange: [-CARD_WIDTH, 0, CARD_WIDTH],
            outputRange: [CARD_WIDTH, 0, -CARD_WIDTH],
          });

          const scale = animation.interpolate({
            inputRange: [-CARD_WIDTH, 0, CARD_WIDTH],
            outputRange: [0.8, 1, 0.8],
          });

          const rotateY = animation.interpolate({
            inputRange: [-CARD_WIDTH, 0, CARD_WIDTH],
            outputRange: ["45deg", "0deg", "-45deg"],
          });

          const opacity = animation.interpolate({
            inputRange: [-CARD_WIDTH, 0, CARD_WIDTH],
            outputRange: [0.5, 1, 0.5],
          });

          return (
            <Animated.View
              key={card.id}
              style={[
                styles.cardContainer,
                {
                  transform: [
                    { translateX },
                    { scale },
                    { perspective: 1000 },
                    { rotateY },
                  ],
                  opacity,
                  zIndex: currentIndex === index ? 1 : 0,
                },
              ]}
              {...(currentIndex === index ? panResponder.panHandlers : {})}
            >
              <LinearGradient
                colors={card.colors}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.title}>{card.title}</Text>
                <Text style={styles.description}>{card.description}</Text>
              </LinearGradient>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.pagination}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: "absolute",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#rgba(255,255,255,0.5)",
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: "white",
    transform: [{ scale: 1.2 }],
  },
});
