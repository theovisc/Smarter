// src/screens/NBackVisualScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export default function NBackVisualScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ⚙️ Paramètres (surchargeables via navigation)
  const N = Math.max(1, Math.min(4, route.params?.n ?? 2));
  const LENGTH = route.params?.length ?? 30;
  const INTERVAL_MS = route.params?.intervalMs ?? 2000;
  const GRID = route.params?.grid ?? 3; // 3x3 par défaut
  const CELLS = GRID * GRID;

  // États
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  // Scores
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const respondedRef = useRef(false);
  const timerRef = useRef(null);

  // 🔢 Génère une séquence semi-aléatoire avec ~25 % de cibles
  const makeSequence = (len) => {
    const arr = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      const canTarget = i >= N && Math.random() < 0.25;
      if (canTarget) {
        arr[i] = arr[i - N];
      } else {
        let cand = Math.floor(Math.random() * CELLS);
        let safety = 0;
        while (i > 0 && cand === arr[i - 1] && safety < 10) {
          cand = Math.floor(Math.random() * CELLS);
          safety++;
        }
        arr[i] = cand;
      }
    }
    return arr;
  };

  const isTarget = useMemo(() => {
    if (!sequence.length || index < N) return false;
    return sequence[index] === sequence[index - N];
  }, [sequence, index, N]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const stop = () => {
    setRunning(false);
    setFinished(true);
    clearTimer();
  };

  const start = () => {
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setCorrectRejections(0);
    const seq = makeSequence(LENGTH);
    setSequence(seq);
    setIndex(0);
    setFinished(false);
    setRunning(true);
  };

  // 🎬 Boucle principale
  useEffect(() => {
    if (!running) return;

    respondedRef.current = false;
    setAwaitingResponse(true);

    timerRef.current = setTimeout(() => {
      setAwaitingResponse(false);

      if (isTarget && !respondedRef.current) {
        setMisses((m) => m + 1);
      }

      if (index + 1 >= LENGTH) {
        stop();
      } else {
        setIndex((i) => i + 1);
      }
    }, INTERVAL_MS);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, isTarget]);

  // 🖱️ Réponses utilisateur
  const onPressSame = () => {
    if (!running || !awaitingResponse) return;
    respondedRef.current = true;
    setAwaitingResponse(false);

    if (isTarget) setHits((h) => h + 1);
    else setFalseAlarms((f) => f + 1);
  };

  const onPressDifferent = () => {
    if (!running || !awaitingResponse) return;
    respondedRef.current = true;
    setAwaitingResponse(false);

    if (isTarget) setMisses((m) => m + 1);
    else setCorrectRejections((c) => c + 1);
  };

  // Démarre automatiquement au montage
  useEffect(() => {
    start();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accuracy =
    hits + correctRejections > 0
      ? Math.round(
          ((hits + correctRejections) /
            (hits + misses + falseAlarms + correctRejections)) *
            100
        )
      : 0;

  const currentCell = sequence[index] ?? -1;
  const cells = Array.from({ length: CELLS }, (_, i) => i);

  return (
    <View style={{ flex: 1 }}>
      {/* Fond vert cohérent “Mental” */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>N-Back visuel</Text>
          <View style={{ width: responsiveWidth(20), alignItems: "flex-end" }}>
            <View style={styles.nBadge}>
              <Text style={styles.nText}>N = {N}</Text>
            </View>
          </View>
        </View>

        {/* Progression */}
        <Text style={styles.progress}>
          Essai {Math.min(index + 1, LENGTH)} / {LENGTH}
        </Text>

        {/* Grille 3x3 */}
        <View style={[styles.grid, { width: responsiveWidth(70), aspectRatio: 1 }]}>
          {cells.map((i) => {
            const isActive = i === currentCell && awaitingResponse;
            return (
              <View
                key={i}
                style={[styles.cell, isActive && styles.cellActive]}
              />
            );
          })}
        </View>

        {/* Boutons */}
        {!finished ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onPressDifferent}
              activeOpacity={0.85}
              style={[styles.actionBtn, styles.diffBtn]}
            >
              <Text style={styles.actionTxt}>Différent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressSame}
              activeOpacity={0.85}
              style={[styles.actionBtn, styles.sameBtn]}
            >
              <Text style={styles.actionTxt}>Même (N-back)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Terminé 🎯</Text>
            <Text style={styles.resultLine}>Hits (bons “même”) : {hits}</Text>
            <Text style={styles.resultLine}>Ratés (cibles manquées) : {misses}</Text>
            <Text style={styles.resultLine}>Faux positifs : {falseAlarms}</Text>
            <Text style={styles.resultLine}>Rejets corrects : {correctRejections}</Text>
            <Text style={styles.resultScore}>Précision : {accuracy}%</Text>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.restartBtn} onPress={start}>
                <Text style={styles.restartTxt}>Rejouer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.restartBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.restartTxt}>Retour</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingHorizontal: responsiveWidth(6) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: responsiveHeight(1),
  },
  backBtn: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
  },
  backTxt: { color: "#0f5132", fontWeight: "600", fontSize: responsiveFontSize(1.9) },
  title: { fontSize: responsiveFontSize(3), fontWeight: "800", color: "#0f5132" },
  nBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: 10,
  },
  nText: { color: "#0f5132", fontWeight: "700", fontSize: responsiveFontSize(1.8) },
  progress: {
    color: "#0f5132",
    fontSize: responsiveFontSize(2),
    opacity: 0.9,
    textAlign: "center",
    marginTop: responsiveHeight(1.5),
    marginBottom: responsiveHeight(2),
  },
  grid: {
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: responsiveWidth(2.5),
    marginBottom: responsiveHeight(3),
  },
  cell: {
    width: "30%",
    height: responsiveHeight(10),
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  cellActive: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#2ecc71",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
  },
  actionsRow: {
    flexDirection: "row",
    gap: responsiveWidth(4),
    justifyContent: "center",
  },
  actionBtn: {
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  diffBtn: { backgroundColor: "rgba(231, 76, 60, 0.9)" },
  sameBtn: { backgroundColor: "rgba(46, 204, 113, 0.95)" },
  actionTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: responsiveFontSize(2.1),
  },
  resultBox: { alignItems: "center", gap: responsiveHeight(1), marginTop: responsiveHeight(2) },
  resultTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: "900",
    color: "#073b27",
    marginBottom: responsiveHeight(1),
  },
  resultLine: { fontSize: responsiveFontSize(2.1), color: "#0f5132" },
  resultScore: {
    fontSize: responsiveFontSize(2.4),
    color: "#0f5132",
    fontWeight: "800",
    marginTop: responsiveHeight(1),
  },
  resultActions: { flexDirection: "row", gap: responsiveWidth(4), marginTop: responsiveHeight(2) },
  restartBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  restartTxt: { color: "#0f5132", fontWeight: "700", fontSize: responsiveFontSize(2) },
});
