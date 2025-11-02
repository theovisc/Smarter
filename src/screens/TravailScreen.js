// A REVOIR !
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import Slider from "@react-native-community/slider";

export default function TravailScreen() {
  const [isWorking, setIsWorking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [productivity, setProductivity] = useState(5);
  const [note, setNote] = useState("");
  const intervalRef = useRef(null);

  const messages = [
    "Chaque minute compte 💪",
    "Tu construis ta discipline, pas juste ta productivité 🔥",
    "Focus maintenant, fierté plus tard 🚀",
    "Sois la personne que ton futur toi remerciera 🙌",
  ];

  const [motivation, setMotivation] = useState(messages[Math.floor(Math.random() * messages.length)]);

  // Gestion du chrono
  useEffect(() => {
    if (isWorking) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isWorking]);

  const toggleWork = () => {
    setIsWorking(!isWorking);
    if (!isWorking) {
      setSeconds(0);
      setMotivation(messages[Math.floor(Math.random() * messages.length)]);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#4A90E2", "#007AFF"]} style={styles.gradient}>
        <Text style={styles.title}>Session de Travail</Text>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>

        <TouchableOpacity onPress={toggleWork} style={styles.button}>
          <Text style={styles.buttonText}>{isWorking ? "STOP" : "DÉMARRER"}</Text>
        </TouchableOpacity>

        {!isWorking && seconds > 0 && (
          <View style={styles.results}>
            <Text style={styles.label}>Ta productivité (sur 10)</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={productivity}
              onValueChange={setProductivity}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#fff"
            />
            <Text style={styles.value}>{productivity}/10</Text>

            <TextInput
              placeholder="Notes, distractions, sensations..."
              placeholderTextColor="#ccc"
              style={styles.input}
              value={note}
              onChangeText={setNote}
            />
          </View>
        )}

        <View style={styles.motivationBox}>
          <Text style={styles.motivation}>{motivation}</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: responsiveWidth(6),
  },
  title: {
    fontSize: responsiveFontSize(3),
    color: "#fff",
    fontWeight: "700",
    marginBottom: responsiveHeight(2),
  },
  timer: {
    fontSize: responsiveFontSize(6),
    color: "#fff",
    marginBottom: responsiveHeight(2),
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(15),
    borderRadius: 20,
    marginBottom: responsiveHeight(3),
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: responsiveFontSize(2.2) },
  results: { width: "100%", alignItems: "center" },
  label: { color: "#fff", fontSize: responsiveFontSize(2), marginBottom: responsiveHeight(1) },
  slider: { width: "90%", height: 40 },
  value: { color: "#fff", fontSize: responsiveFontSize(2.2), fontWeight: "600", marginBottom: 10 },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    fontSize: responsiveFontSize(1.8),
  },
  motivationBox: {
    marginTop: responsiveHeight(5),
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 15,
    width: "90%",
  },
  motivation: {
    color: "#fff",
    textAlign: "center",
    fontSize: responsiveFontSize(2),
    fontStyle: "italic",
  },
});
