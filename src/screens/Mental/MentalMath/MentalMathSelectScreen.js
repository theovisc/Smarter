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

export default function CalculMentalSelectScreen() {
  const navigation = useNavigation();

  const modes = [
    { label: "IA (Premium)", value: "ia", premium: true, colors: ["#00c6ff", "#0072ff"] },
    { label: "Facile", value: "facile", colors: ["#81fbb8", "#28c76f"] },
    { label: "Moyen", value: "moyen", colors: ["#fdfb71", "#ffb347"] },
    { label: "Difficile", value: "difficile", colors: ["#ff5858", "#fb7ba2"] },
  ];

  return (
    <View style={{ flex: 1 }}>
      {/* 🌿 Fond vert cohérent avec la section Mental */}
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
            onPress={() => {
              if (m.premium) {
                // Pour l’instant : afficher un message ou une future pop-up premium
                alert("Version Premium disponible bientôt 🚀");
              } else {
                navigation.navigate("CalculMental", { level: m.value });
              }
            }}
          >
            <LinearGradient
              colors={m.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.option}
            >
              <Text style={styles.optionText}>{m.label}</Text>
              {m.premium && <Text style={styles.premiumTag}>👑</Text>}
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
    gap: responsiveWidth(2),
  },
  optionText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: responsiveFontSize(2.4),
  },
  premiumTag: {
    fontSize: responsiveFontSize(2.5),
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
