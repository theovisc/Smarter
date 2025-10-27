import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>👋 Bonjour Théo</Text>
      <Text style={styles.subtitle}>Prêt à devenir plus fort ?</Text>

      <TouchableOpacity style={styles.focusButton}>
        <Ionicons name="flash-outline" size={28} color="#fff" />
        <Text style={styles.focusText}>Mode Focus</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.smallButton}>
          <Ionicons name="bar-chart-outline" size={22} color="#fff" />
          <Text style={styles.smallText}>Mes progrès</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallButton}>
          <Ionicons name="body-outline" size={22} color="#fff" />
          <Text style={styles.smallText}>Habitudes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a192f",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    color: "#64ffda",
    fontSize: 18,
    marginBottom: 40,
  },
  focusButton: {
    backgroundColor: "#0077ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: "#0077ff",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  focusText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 60,
    justifyContent: "space-between",
    width: "80%",
  },
  smallButton: {
    backgroundColor: "#112240",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
  },
  smallText: {
    color: "#fff",
    marginTop: 6,
  },
});
