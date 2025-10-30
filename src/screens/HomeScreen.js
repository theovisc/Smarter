import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";


export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  // 👉 Si l’appareil a une encoche (iPhone X et +)
  // on réduit légèrement la marge SafeArea en bas
  const adjustedMarginBottom = insets.bottom > 20 ? -10 : 0;
  const bottomSpace = responsiveHeight(12) + insets.bottom; // hauteur bandeau + zone safe

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Contenu principal */}
      <View style={[styles.container, {paddingBottom: bottomSpace}]}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Bonjour, Théo</Text>
          <Text style={styles.subtitle}>
            Deviens une meilleure version de toi-même
          </Text>
        </View>

        {/* Bouton Daily Boost */}
        <TouchableOpacity activeOpacity={0.8}
          onPress={() => navigation.navigate("DailyBoost")}>
          <LinearGradient
            colors={["#2ecc71", "#1E88E5", "#e74c3c"]} // dégradé vert → bleu → rouge
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dailyBoost}
          >
            <Text style={styles.DailyBoostText}>Daily Boost</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Couleur sous la barre pour combler l’espace blanc sur iPhone */}
      {insets.bottom > 20 && (
        <View style={[styles.bottomFill, { height: insets.bottom }]} />
      )}

      {/* Bandeau du bas */}
      <View
        style={[
          styles.bottomBar,
          { marginBottom: adjustedMarginBottom }, // 👈 décale le bandeau si encoche
        ]}
      >
        <TouchableOpacity style={[styles.button, styles.mental]}
          onPress={() => navigation.navigate("Mental")}>
          
          <Text style={styles.buttonText}>Mental</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle}
          onPress={() => navigation.navigate("IA")}>
          <Text style={styles.circleText}>IA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.physique]}
          onPress={() => navigation.navigate("Physique")}>
          <Text style={styles.buttonText}>Physique</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // fond global
  },

  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  textBlock: {
    alignItems: "center",
    marginBottom: responsiveHeight(30), // espace entre texte et Daily Boost
  },

  title: {
    fontSize: responsiveFontSize(4.4),
    fontWeight: "bold",
    color: "#333",
  },

  subtitle: {
    fontSize: responsiveFontSize(2.3),
    color: "#333",
  },

  DailyBoostText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.5),
  },

  dailyBoost: {
    width: responsiveWidth(35),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(2),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },

  bottomBar: {
    position: "absolute", // 👈 nécessaire pour pouvoir la déplacer librement
    bottom: 0, // collée au bas de l’écran
    width: "100%",
    height: responsiveHeight(12),
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  bottomFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f0f0f0", // même couleur que la barre
  },

  button: {
    width: responsiveWidth(28),
    height: responsiveHeight(6.5),
    borderRadius: responsiveHeight(1.8),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(2.5),
  },

  mental: {
    backgroundColor: "#2ecc71", // vert
  },

  physique: {
    backgroundColor: "#e74c3c", // rouge
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.3),
  },

  circle: {
    width: responsiveHeight(7),
    height: responsiveHeight(7),
    borderRadius: responsiveHeight(3.5),
    backgroundColor: "#1E88E5", // bleu
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(2.5),
  },

  circleText: {
    color: "#fff",
    fontSize: responsiveFontSize(2.3),
    fontWeight: "bold",
  },
});
