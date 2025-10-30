import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function MentalScreen() {
  const [challenges, setChallenges] = useState([
    { id: "1", name: "Calcul mental", time: "3 min", benefits: "Améliore la vitesse de raisonnement", done: false },
    { id: "2", name: "N-Back",       time: "5 min", benefits: "Renforce la mémoire de travail",       done: false },
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
      onPress={() => toggleChallenge(item.id)}
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
        colors={["#e8f7ee", "#c7efda", "#a4e5c2", "#7fd7a6"]} // vert très clair → vert doux
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
});
