import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function NBackVisuelInfoScreen() {
  const navigation = useNavigation();

  // États des paramètres
  const [n, setN] = useState(2);
  const [interval, setInterval] = useState(2);
  const [length, setLength] = useState(30);
  const [grid, setGrid] = useState(3);

  const startGame = () => {
    navigation.navigate("NBackVisuel", {
      n,
      intervalMs: interval * 1000,
      length,
      grid,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🌿 FOND DÉGRADÉ */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>N-Back Visuel</Text>

        {/* 🧠 Explication simple des règles */}
        <View style={styles.rulesContainer}>
          <Text style={styles.rulesText}>
            Mémorise la position du carré qui s’allume.
          </Text>
          <Text style={styles.rulesText}>
            Appuie sur <Text style={styles.bold}>"Même (N-Back)"</Text> quand la case est <Text style={styles.bold}>la même qu’il y a N tours</Text>.
          </Text>
          <Text style={styles.rulesText}>
            Appuie sur <Text style={styles.bold}>"Différent"</Text> sinon.
          </Text>
        </View>


        {/* 👀 Bouton vers le tutoriel visuel */}
        <TouchableOpacity
          onPress={() => navigation.navigate("NBackVisuelTutorial")}
          style={styles.tutoButton}
        >
          <LinearGradient
            colors={["#8cd1d1ff", "#25c448ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Voir explication visuelle 👀</Text>
          </LinearGradient>
        </TouchableOpacity>


        {/* 🎚️ PARAMÈTRES */}
        <View style={styles.paramContainer}>
          <Text style={styles.paramLabel}>N : {n}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            minimumTrackTintColor="#2e8b57"
            maximumTrackTintColor="#d0d0d0"
            thumbTintColor="#0f5132"
            value={n}
            onValueChange={setN}
          />

          <Text style={styles.paramLabel}>
            Temps d’affichage : {interval.toFixed(1)} s
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={3}
            step={0.1}
            minimumTrackTintColor="#2e8b57"
            maximumTrackTintColor="#d0d0d0"
            thumbTintColor="#0f5132"
            value={interval}
            onValueChange={setInterval}
          />

          <Text style={styles.paramLabel}>
            Longueur totale : {length} éléments
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={15}
            maximumValue={60}
            step={1}
            minimumTrackTintColor="#2e8b57"
            maximumTrackTintColor="#d0d0d0"
            thumbTintColor="#0f5132"
            value={length}
            onValueChange={setLength}
          />

          <Text style={styles.paramLabel}>Taille de la grille : {grid}x{grid} (A CORRIGER)</Text>
          <Slider
            style={styles.slider}
            minimumValue={3}
            maximumValue={5}
            step={1}
            minimumTrackTintColor="#2e8b57"
            maximumTrackTintColor="#d0d0d0"
            thumbTintColor="#0f5132"
            value={grid}
            onValueChange={setGrid}
          />
        </View>

        {/* 🔘 Boutons Commencer / Retour */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            activeOpacity={0.85}
            onPress={startGame}
          >
            <LinearGradient
              colors={["#81fbb8", "#28c76f"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Commencer →</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: responsiveHeight(3),
    textAlign: "center",
  },
  tutoButton: {
  width: responsiveWidth(75),
  borderRadius: responsiveHeight(2),
  overflow: "hidden",
  marginBottom: responsiveHeight(2),
  },

  rulesContainer: {
    width: responsiveWidth(85),
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
  },
  rulesText: {
    fontSize: responsiveFontSize(2.1),
    color: "#1c3520",
    textAlign: "center",
    marginBottom: responsiveHeight(0.8),
  },
  bold: {
    fontWeight: "bold",
    color: "#0f5132",
  },
  paramContainer: {
    width: responsiveWidth(85),
    marginBottom: responsiveHeight(2),
  },
  paramLabel: {
    fontSize: responsiveFontSize(2.1),
    color: "#0f5132",
    fontWeight: "600",
    marginTop: responsiveHeight(1.4),
  },
  slider: {
    width: "100%",
    height: responsiveHeight(3.8),
  },
  buttonsContainer: {
    alignItems: "center",
    marginTop: responsiveHeight(3),
  },
  button: {
    width: responsiveWidth(65),
    borderRadius: responsiveHeight(2),
    marginBottom: responsiveHeight(1.5),
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: responsiveHeight(2),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.3),
  },
  backButton: {
    marginTop: responsiveHeight(0.5),
  },
  backText: {
    fontSize: responsiveFontSize(2.2),
    color: "#0f5132",
    fontWeight: "600",
  },
});
