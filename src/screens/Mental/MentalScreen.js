import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

export default function MentalScreen() {
  const navigation = useNavigation();
  const [challenges, setChallenges] = useState([
    { id: "1", name: "Calcul mental", time: "1 min", benefits: "Améliore la vitesse de raisonnement", done: false },
    { id: "2", name: "N-Back",       time: "1-2 min", benefits: "Renforce la mémoire de travail",       done: false },
  ]);

  const toggleChallenge = (id) => {
    setChallenges(prev => prev.map(it => it.id === id ? { ...it, done: !it.done } : it));
  };

  const renderChallenge = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        { backgroundColor: item.done ? "#a5d6a7" : "rgba(245,245,245,0.95)" },
      ]}
      onPress={() => {
        if (item.name === "Calcul mental") {
          navigation.navigate("CalculMentalSelect");
        } else if (item.name === "N-Back") {
          navigation.navigate("NBackSelect");
        } else {
          toggleChallenge(item.id);
        }
      }}
      activeOpacity={0.85}
    >
      <Text style={styles.challengeTitle}>{item.name}</Text>
      <Text style={styles.challengeTime}>⏱ {item.time}</Text>
      <Text style={styles.challengeBenefits}>{item.benefits}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* FOND D'ÉCRAN EN DÉGRADÉ */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]} // vert très clair → vert doux
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* CONTENU */}
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Défis Mentaux</Text>

        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          renderItem={renderChallenge}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Home", { animation: "slide_from_right" })
          }
          style={styles.backButton}
        >
          <Text style={styles.backText}>Retour →</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent", // important: laisser voir le gradient
  },
  title: {
    fontSize: responsiveFontSize(3.9), // + un poil
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: responsiveHeight(3),
    color: "#224236",
  },
  listContainer: {
    alignItems: "center",
    paddingBottom: responsiveHeight(5),
  },
  challengeCard: {
    width: responsiveWidth(88),
    paddingVertical: responsiveHeight(3.4),   // un peu plus haut
    paddingHorizontal: responsiveWidth(6.5),  // un peu plus large
    borderRadius: responsiveHeight(2.4),
    marginVertical: responsiveHeight(1.6),
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  challengeTitle: {
    fontSize: responsiveFontSize(3.0), // + léger
    fontWeight: "bold",
    color: "#2b2b2b",
    marginBottom: responsiveHeight(1.0),
  },
  challengeTime: {
    fontSize: responsiveFontSize(2.2),
    color: "#3d3d3d",
    marginBottom: responsiveHeight(0.7),
  },
  challengeBenefits: {
    fontSize: responsiveFontSize(2.1),
    color: "#4a4a4a",
  },
  backButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center", 
    bottom: responsiveHeight(4),
    left: 0,
    right: 0,             
  },
  backText: {
    fontSize: responsiveFontSize(2.2),
    color: "#0f5132",
    fontWeight: "600",
  },
});
