// src/screens/NBackScreen.js
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

const LETTERS = "ABCDEFGH".split(""); // alphabet restreint = plus lisible/vite

export default function NBackScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // Paramètres (tu peux les passer via navigation : { n: 2, length: 30, intervalMs: 2000 })
  const N = Math.max(1, Math.min(4, route.params?.n ?? 2));
  const LENGTH = route.params?.length ?? 30;
  const INTERVAL_MS = route.params?.intervalMs ?? 2000;

  // État principal
  const [index, setIndex] = useState(0);         // index courant dans la séquence
  const [sequence, setSequence] = useState([]);  // suite de lettres
  const [running, setRunning] = useState(false); // séquence en cours ?
  const [finished, setFinished] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false); // fenêtre de réponse ouverte

  // Scores
  const [hits, setHits] = useState(0);           // bonne détection “match”
  const [misses, setMisses] = useState(0);       // cible non cliquée
  const [falseAlarms, setFalseAlarms] = useState(0); // clic “match” alors que non-cible
  const [correctRejections, setCorrectRejections] = useState(0);   // “différent” sur non-cible
  const respondedRef = useRef(false);            // l’utilisateur a-t-il répondu sur ce trial ?

  const timerRef = useRef(null);

  // Génération d’une séquence semi-aléatoire (évite trop de répétitions inutiles)
  const makeSequence = (len) => {
    const arr = new Array(len).fill(null);
    for (let i = 0; i < len; i++) {
      // Pour limiter les répétitions immédiates hors cibles :
      const prev = i > 0 ? arr[i - 1] : null;
      let cand = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      // 20% de chances d’imposer une cible si possible
      const canTarget = i >= N && Math.random() < 0.2;
      if (canTarget) {
        cand = arr[i - N];
      } else {
        // sinon, évite juste de répéter la même lettre que juste avant (si non-cible)
        let safety = 0;
        while (prev && cand === prev && safety < 10) {
          cand = LETTERS[Math.floor(Math.random() * LETTERS.length)];
          safety++;
        }
      }
      arr[i] = cand;
    }
    return arr;
  };

  const isTarget = useMemo(() => {
    if (!sequence.length || index < N) return false;
    return sequence[index] === sequence[index - N];
  }, [sequence, index, N]);

  // Lancement / arrêt propre
  const start = () => {
    setHits(0); setMisses(0); setFalseAlarms(0); setCorrectRejections(0);
    const seq = makeSequence(LENGTH);
    setSequence(seq);
    setIndex(0);
    setFinished(false);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    setFinished(true);
    clearTimer();
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Boucle de présentation des stimuli
  useEffect(() => {
    if (!running) return;

    // À chaque stimulus :
    respondedRef.current = false;
    setAwaitingResponse(true);

    timerRef.current = setTimeout(() => {
      // Fin de fenêtre de réponse pour ce stimulus
      setAwaitingResponse(false);

      // Si c’était une cible et aucune réponse → miss
      if (isTarget && !respondedRef.current) {
        setMisses((m) => m + 1);
      }
      // Si pas cible et pas de réponse → correct rejection implicite ?
      // On ne compte pas les non-clics, on comptera les rejets corrects si l’utilisateur clique “différent”.
      // (Option : incrémenter un compteur de “skips corrects” ici si tu veux.)

      // Passage au prochain ou fin
      if (index + 1 >= LENGTH) {
        stop();
      } else {
        setIndex((i) => i + 1);
      }
    }, INTERVAL_MS);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, isTarget]);

  // Réponses utilisateur
  const onPressSame = () => {
    if (!running || !awaitingResponse) return;
    respondedRef.current = true;
    setAwaitingResponse(false);

    if (isTarget) {
      setHits((h) => h + 1);
    } else {
      setFalseAlarms((f) => f + 1);
    }
  };

  const onPressDifferent = () => {
    if (!running || !awaitingResponse) return;
    respondedRef.current = true;
    setAwaitingResponse(false);

    if (isTarget) {
      // Mauvaise réponse (c’était “même”)
      setMisses((m) => m + 1);
    } else {
      setCorrectRejections((c) => c + 1);
    }
  };

  // Démarre auto au montage
  useEffect(() => {
    start();
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accuracy =
    hits + correctRejections > 0
      ? Math.round(((hits + correctRejections) / (hits + misses + falseAlarms + correctRejections)) * 100)
      : 0;

  return (
    <View style={{ flex: 1 }}>
      {/* Fond vert (cohérent “Mental”) */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>N-Back</Text>
          <View style={{ width: responsiveWidth(20), alignItems: "flex-end" }}>
            <View style={styles.nBadge}><Text style={styles.nText}>N = {N}</Text></View>
          </View>
        </View>

        {/* Zone centrale : stimulus + progression */}
        <View style={styles.center}>
          <Text style={styles.progress}>
            Essai {Math.min(index + 1, LENGTH)} / {LENGTH}
          </Text>

          <View style={[styles.stimulusCard, awaitingResponse && styles.stimulusActive]}>
            <Text style={styles.stimulusText}>
              {sequence[index] ?? "—"}
            </Text>
            {index >= N && (
              <Text style={styles.helper}>
                Compare avec l’élément {N} en arrière
              </Text>
            )}
          </View>

          {/* Boutons de réponse */}
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
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: responsiveWidth(6),
  },
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
  backTxt: {
    color: "#0f5132",
    fontWeight: "600",
    fontSize: responsiveFontSize(1.9),
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: "800",
    color: "#0f5132",
  },
  nBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: 10,
  },
  nText: {
    color: "#0f5132",
    fontWeight: "700",
    fontSize: responsiveFontSize(1.8),
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: responsiveHeight(2),
  },
  progress: {
    color: "#0f5132",
    fontSize: responsiveFontSize(2),
    opacity: 0.9,
  },
  stimulusCard: {
    width: responsiveWidth(70),
    height: responsiveHeight(25),
    borderRadius: responsiveHeight(2.5),
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  stimulusActive: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  stimulusText: {
    fontSize: responsiveFontSize(8),
    fontWeight: "900",
    color: "#083b2a",
  },
  helper: {
    marginTop: responsiveHeight(1),
    color: "#0f5132",
    fontSize: responsiveFontSize(1.8),
    opacity: 0.8,
  },

  actionsRow: {
    flexDirection: "row",
    gap: responsiveWidth(4),
    marginTop: responsiveHeight(2),
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
  diffBtn: {
    backgroundColor: "rgba(231, 76, 60, 0.9)",
  },
  sameBtn: {
    backgroundColor: "rgba(46, 204, 113, 0.95)",
  },
  actionTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: responsiveFontSize(2.1),
  },

  resultBox: {
    alignItems: "center",
    gap: responsiveHeight(1),
    marginTop: responsiveHeight(2),
  },
  resultTitle: {
    fontSize: responsiveFontSize(3),
    fontWeight: "900",
    color: "#073b27",
    marginBottom: responsiveHeight(1),
  },
  resultLine: {
    fontSize: responsiveFontSize(2.1),
    color: "#0f5132",
  },
  resultScore: {
    fontSize: responsiveFontSize(2.4),
    color: "#0f5132",
    fontWeight: "800",
    marginTop: responsiveHeight(1),
  },
  resultActions: {
    flexDirection: "row",
    gap: responsiveWidth(4),
    marginTop: responsiveHeight(2),
  },
  restartBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  restartTxt: {
    color: "#0f5132",
    fontWeight: "700",
    fontSize: responsiveFontSize(2),
  },
});
