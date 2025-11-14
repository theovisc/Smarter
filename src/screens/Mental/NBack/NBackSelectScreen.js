import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function NBackSelectScreen() {
  const navigation = useNavigation();

  const modes = [
    {
      label: "N-Back Visuel",
      value: "visuel",
      colors: ["#81fbb8", "#28c76f"], 
      target: "NBackVisuelInfo",
    },
    {
      label: "N-Back Lettres",
      value: "lettres",
      colors: ["#fdef71ff", "#ffb347"],
      target: "NBackInfo",
    },
    {
      label: "N-Back Dual",
      value: "dual",
      colors: ["#ff5858", "#fb7ba2"],
      target: "NBackDualInfo",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* 🧠 Fond vert doux pour cohérence section Mental */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Choisis ton mode</Text>

        {modes.map((m) => (
          <TouchableOpacity
            key={m.value}
            activeOpacity={0.85}
            style={styles.optionWrapper}
            onPress={() => navigation.navigate(m.target)}
          >
            <LinearGradient
              colors={m.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.option}
            >
              <Text style={styles.optionText}>{m.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: "bold",
    color: "#0f5132",
    marginBottom: responsiveHeight(4),
    textAlign: "center",
  },
  optionWrapper: {
    width: responsiveWidth(80),
  },
  option: {
    borderRadius: responsiveHeight(2),
    paddingVertical: responsiveHeight(2.5),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
  },
  optionText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: responsiveFontSize(2.4),
  },
  backButton: {
    position: "absolute",
    bottom: responsiveHeight(4),
  },
  backText: {
    fontSize: responsiveFontSize(2.2),
    color: "#0f5132",
    fontWeight: "600",
  },
});
