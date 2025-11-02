import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation, useRoute } from "@react-navigation/native";
import NumericKeyboard from "../components/NumericKeyboard";

// --- Helpers niveau → bornes ---
const LEVELS = {
  facile:  { min: 1,  max: 10,  multMax: 10 },
  moyen:   { min: 2,  max: 100, multMax: 12 },
  difficile: { min: 3, max: 1000, multMax: 20 },
};

// Utilitaires
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Générateur d’opérations (+, -, ×, ÷) avec quotient entier pour ÷
function generateQuestion(levelKey = "facile") {
  const { min, max, multMax } = LEVELS[levelKey] || LEVELS.facile;
  const ops = ["+", "-", "×", "÷"];
  const op = ops[randInt(0, ops.length - 1)];

  let a, b, correct;
  if (op === "+") {
    a = randInt(min, max);
    b = randInt(min, max);
    correct = a + b;
  } else if (op === "-") {
    a = randInt(min, max);
    b = randInt(min, a); // évite négatifs
    correct = a - b;
  } else if (op === "×") {
    a = randInt(min, multMax);
    b = randInt(min, multMax);
    correct = a * b;
  } else {
    // ÷ : construit un résultat entier
    b = randInt(min, multMax);
    const q = randInt(min, multMax);
    a = b * q;
    correct = q;
  }

  return {
    text: `${a} ${op} ${b} = ?`,
    answer: String(correct),
  };
}

export default function CalculMentalScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // Paramètre de niveau passé depuis MentalScreen: "facile" | "moyen" | "difficile"
  const level = (route.params?.level || "facile").toLowerCase();

  // État principal
  const [current, setCurrent] = useState(() => generateQuestion(level));
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const lastWasCorrect = useRef(null); // null | true | false

  // Timer 60s
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finished]);

  // Couleurs de feedback pour le cadre de la réponse
  const inputBorderColor = useMemo(() => {
    if (lastWasCorrect.current === true) return "#2ecc71";
    if (lastWasCorrect.current === false) return "#e74c3c";
    return "rgba(255,255,255,0.6)";
  }, [attempts]); // recalcul à chaque tentative

  // Gestion clavier numérique
  const onKeyPress = (key) => {
    if (finished) return;

    if (key === "del") {
      setUserInput((s) => s.slice(0, -1));
      return;
    }
    if (key === "ok") {
      // Valider la réponse
      setAttempts((n) => n + 1);
      if (userInput.length === 0) return;

      if (userInput === current.answer) {
        setScore((s) => s + 1);
        lastWasCorrect.current = true;
      } else {
        lastWasCorrect.current = false;
      }
      // Nouvelle question
      setCurrent(generateQuestion(level));
      setUserInput("");
      return;
    }
    // key numérique ou signe '-'
    if (/^\d$/.test(key) || (key === "-" && userInput.length === 0)) {
      setUserInput((s) => (s + key).slice(0, 8)); // limite longueur
    }
  };

  const restart = () => {
    setScore(0);
    setAttempts(0);
    setTimeLeft(60);
    setFinished(false);
    setUserInput("");
    lastWasCorrect.current = null;
    setCurrent(generateQuestion(level));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Fond vert (section Mental) */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header simple */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Accueil</Text>
          </TouchableOpacity>
          <Text style={styles.timer}>{timeLeft}s</Text>
        </View>

        {/* Zone question */}
        <View style={styles.center}>
          <Text style={styles.levelTag}>
            Niveau : {level.charAt(0).toUpperCase() + level.slice(1)}
          </Text>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{current.text}</Text>

            <View style={[styles.answerBox, { borderColor: inputBorderColor }]}>
              <Text style={styles.answerText}>{userInput || "…"}</Text>
            </View>
          </View>

          <Text style={styles.scoreText}>
            Score : {score} / {attempts}
          </Text>
        </View>

        {/* Clavier numérique */}
        {!finished ? (
          <NumericKeyboard onKeyPress={onKeyPress} />
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Temps écoulé ⏱</Text>
            <Text style={styles.resultScore}>Score final : {score} / {attempts}</Text>
            <View style={styles.resultRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={restart}>
                <Text style={styles.actionTxt}>Rejouer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.actionTxt}>Retour</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: responsiveHeight(1),
  },
  backBtn: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
  },
  backTxt: {
    color: "#0f5132",
    fontWeight: "600",
    fontSize: responsiveFontSize(1.8),
  },
  timer: {
    fontSize: responsiveFontSize(3),
    fontWeight: "700",
    color: "#0f5132",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  levelTag: {
    color: "#0f5132",
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveHeight(1),
    opacity: 0.9,
  },
  questionCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 18,
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(4),
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: responsiveFontSize(4.2),
    fontWeight: "800",
    color: "#073b27",
    marginBottom: responsiveHeight(2),
  },
  answerBox: {
    minWidth: responsiveWidth(45),
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  answerText: {
    fontSize: responsiveFontSize(3.2),
    color: "#0f5132",
    textAlign: "center",
    fontWeight: "700",
  },
  scoreText: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2.2),
    color: "#0f5132",
    opacity: 0.9,
  },
  resultBox: {
    alignItems: "center",
    paddingBottom: responsiveHeight(4),
  },
  resultTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: "800",
    color: "#073b27",
    marginBottom: responsiveHeight(1),
  },
  resultScore: {
    fontSize: responsiveFontSize(2.4),
    color: "#0f5132",
    marginBottom: responsiveHeight(2),
  },
  resultRow: {
    flexDirection: "row",
    gap: responsiveWidth(4),
  },
  actionBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    marginHorizontal: responsiveWidth(2),
  },
  actionTxt: {
    color: "#0f5132",
    fontWeight: "700",
    fontSize: responsiveFontSize(2),
  },
});
