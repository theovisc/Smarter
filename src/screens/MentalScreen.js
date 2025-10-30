import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function MentalScreen() {
  // Liste des défis mentaux
  const [challenges, setChallenges] = useState([
    {
      id: "1",
      name: "Calcul mental",
      time: "3 min",
      benefits: "Améliore la vitesse de raisonnement",
      done: false,
    },
    {
      id: "2",
      name: "N-Back",
      time: "5 min",
      benefits: "Renforce la mémoire de travail",
      done: false,
    },
  ]);

  // Fonction de clic : change la couleur quand le défi est fait
  const toggleChallenge = (id) => {
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  // Rendu d'un rectangle de défi
  const renderChallenge = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        { backgroundColor: item.done ? "#a5d6a7" : "#f5f5f5" }, // vert clair si fait
      ]}
      onPress={() => toggleChallenge(item.id)}
      activeOpacity={0.8}
    >
      <View>
        <Text style={styles.challengeTitle}>{item.name}</Text>
        <Text style={styles.challengeTime}>⏱ {item.time}</Text>
        <Text style={styles.challengeBenefits}>{item.benefits}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>🧠 Défis Mentaux</Text>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: responsiveHeight(3),
    color: "#333",
  },
  listContainer: {
    alignItems: "center",
    paddingBottom: responsiveHeight(5),
  },
  challengeCard: {
    width: responsiveWidth(85),
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveHeight(2),
    marginVertical: responsiveHeight(1.5),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  challengeTitle: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: "bold",
    color: "#333",
    marginBottom: responsiveHeight(0.8),
  },
  challengeTime: {
    fontSize: responsiveFontSize(2),
    color: "#555",
    marginBottom: responsiveHeight(0.5),
  },
  challengeBenefits: {
    fontSize: responsiveFontSize(1.9),
    color: "#777",
  },
});
