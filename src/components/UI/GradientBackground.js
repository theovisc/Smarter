// src/components/UI/GradientBackground.js

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { gradients, gradientDirections } from "@utils/theme";

export default function GradientBackground({
  theme = "home",
  direction = "diagonal",
  style,
}) {
  const { start, end } = gradientDirections[direction];

  return (
    <LinearGradient
      colors={gradients[theme]}
      start={start}
      end={end}
      style={[StyleSheet.absoluteFillObject, style]}
    />
  );
}
