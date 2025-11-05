import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TravailScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* Fond dégradé violet */}
      <LinearGradient
        colors={["#f4e8ff", "#e4d1ff", "#d0baff", "#b89cff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* CONTENU */}
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    
  }
});
