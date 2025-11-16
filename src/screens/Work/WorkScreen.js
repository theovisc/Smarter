import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export default function TravailScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalToday, setTotalToday] = useState(0);

  // Charger les sessions sauvegardées au montage et calculer le total du jour
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem("deepWorkSessions");
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions);
          setSessions(parsedSessions);
          calculateTotalToday(parsedSessions);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sessions :", error);
      }
    };
    loadSessions();
  }, []);

  // Fonction pour calculer le temps total du jour
  const calculateTotalToday = (sessionsList) => {
    const today = new Date().toDateString(); // Format "Day Mon DD YYYY"
    const todaySessions = sessionsList.filter(session => 
      new Date(session.date).toDateString() === today
    );
    const total = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    setTotalToday(total);
  };

  // Timer pour mettre à jour le temps écoulé
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Fonction pour démarrer le chronomètre
  const startTimer = () => {
    setStartTime(Date.now() - elapsedTime); // Pour reprendre si nécessaire
    setIsRunning(true);
  };

  // Fonction pour arrêter le chronomètre et sauvegarder
  const stopTimer = async () => {
    setIsRunning(false);
    const session = {
      id: Date.now(),
      duration: elapsedTime,
      date: new Date().toISOString(),
    };
    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    calculateTotalToday(updatedSessions); // Recalculer le total après ajout
    try {
      await AsyncStorage.setItem("deepWorkSessions", JSON.stringify(updatedSessions));
      Alert.alert("Session sauvegardée", `Temps travaillé : ${formatTime(elapsedTime)}`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      Alert.alert("Erreur", "Impossible de sauvegarder la session.");
    }
    setElapsedTime(0); // Réinitialiser pour la prochaine session
  };

  // Fonction pour formater le temps (HH:MM:SS)
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
        {/* Header pour le titre et le total du jour */}
        <View style={styles.header}>
          <Text style={styles.title}>Deep Work</Text>
          <Text style={styles.totalText}>Total aujourd'hui : {formatTime(totalToday)}</Text>
        </View>
        
        {/* Corps centré pour le timer */}
        <View style={styles.body}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            <TouchableOpacity
              style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
              onPress={isRunning ? stopTimer : startTimer}
            >
              <Text style={styles.buttonText}>{isRunning ? "Stop" : "Start"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: "#b89cff", // Ligne de séparation légère
  },
  title: {
    fontSize: responsiveFontSize(4.2),
    fontWeight: "bold",
    color: "#4b0082", // violet foncé
    textAlign: "center",
  },
  totalText: {
    fontSize: responsiveFontSize(2),
    color: "#4b0082",
    textAlign: "center",
    marginTop: responsiveHeight(1),
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    alignItems: "center",
  },
  timerText: {
    fontSize: responsiveFontSize(6),
    fontWeight: "bold",
    color: "#4b0082",
    marginBottom: responsiveHeight(3),
  },
  button: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(10),
    borderRadius: 25,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4b0082", // Violet foncé pour Start
  },
  stopButton: {
    backgroundColor: "#ff4500", // Rouge pour Stop
  },
  buttonText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
    color: "#ffffff",
  },
});
