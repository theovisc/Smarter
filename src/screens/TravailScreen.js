import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Deep Work</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",

  },

  title: {
    fontSize: responsiveFontSize(4.2),
    fontWeight: "bold",
    color: "#4b0082", // violet foncé
    textAlign: "center",
    marginVertical: responsiveHeight(3),
  }
});
