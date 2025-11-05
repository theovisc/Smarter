// src/screens/NBackDualScreen.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split(""); // set restreint, clair à l'oreille

export default function NBackDualScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ⚙️ Paramètres (tous sont optionnels)
  const INITIAL_N = Math.max(1, Math.min(4, route.params?.n ?? 2));
  const LENGTH_PER_BLOCK = route.params?.lengthPerBlock ?? 20;
  const BLOCKS = route.params?.blocks ?? 2; // total = LENGTH_PER_BLOCK * BLOCKS
  const INTERVAL_MS = route.params?.intervalMs ?? 2000;
  const GRID = route.params?.grid ?? 3; // 3x3
  const CELLS = GRID * GRID;

  // État d'exécution
  const [block, setBlock] = useState(1);
  const [N, setN] = useState(INITIAL_N);
  const [index, setIndex] = useState(0);                // index dans le bloc courant
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  // Séquences courantes (par bloc)
  const [posSeq, setPosSeq] = useState([]);
  const [sndSeq, setSndSeq] = useState([]);

  // Scores par bloc (visuel / audio)
  const [hitsPos, setHitsPos] = useState(0);
  const [missesPos, setMissesPos] = useState(0);
  const [falsePosPos, setFalsePosPos] = useState(0);
  const [correctRejectPos, setCorrectRejectPos] = useState(0);

  const [hitsAud, setHitsAud] = useState(0);
  const [missesAud, setMissesAud] = useState(0);
  const [falsePosAud, setFalsePosAud] = useState(0);
  const [correctRejectAud, setCorrectRejectAud] = useState(0);

  // Scores cumulés (tous blocs)
  const [cum, setCum] = useState({
    hitsPos: 0, missesPos: 0, falsePosPos: 0, correctRejectPos: 0,
    hitsAud: 0, missesAud: 0, falsePosAud: 0, correctRejectAud: 0,
  });

  // Réponses de l'essai courant (deux flux)
  const respondedPosRef = useRef(false);
  const respondedAudRef = useRef(false);

  const timerRef = useRef(null);

  // Génère une séquence semi-aléatoire avec ~25% de cibles
  const makeSequencePositions = (len, n) => {
    const arr = new Array(len).fill(0);
    for (let i = 0; i < len; i++) {
      const canTarget = i >= n && Math.random() < 0.25;
      if (canTarget) {
        arr[i] = arr[i - n];
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

  const makeSequenceSounds = (len, n) => {
    const arr = new Array(len).fill(null);
    for (let i = 0; i < len; i++) {
      const canTarget = i >= n && Math.random() < 0.25;
      if (canTarget) {
        arr[i] = arr[i - n];
      } else {
        let cand = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        let safety = 0;
        while (i > 0 && cand === arr[i - 1] && safety < 10) {
          cand = LETTERS[Math.floor(Math.random() * LETTERS.length)];
          safety++;
        }
        arr[i] = cand;
      }
    }
    return arr;
  };

  // Détermine si la cible est attendue (visuel / audio)
  const isTargetPos = useMemo(() => {
    if (!posSeq.length || index < N) return false;
    return posSeq[index] === posSeq[index - N];
  }, [posSeq, index, N]);

  const isTargetAud = useMemo(() => {
    if (!sndSeq.length || index < N) return false;
    return sndSeq[index] === sndSeq[index - N];
  }, [sndSeq, index, N]);

  // Démarre un bloc : séquences + index + flags
  const startBlock = (nextBlock, nextN) => {
    setBlock(nextBlock);
    setIndex(0);
    setFinished(false);
    setRunning(true);
    setAwaitingResponse(false);

    respondedPosRef.current = false;
    respondedAudRef.current = false;

    // reset scores block
    setHitsPos(0); setMissesPos(0); setFalsePosPos(0); setCorrectRejectPos(0);
    setHitsAud(0); setMissesAud(0); setFalsePosAud(0); setCorrectRejectAud(0);

    // nouvelles séquences pour ce bloc (avec N courant)
    setPosSeq(makeSequencePositions(LENGTH_PER_BLOCK, nextN));
    setSndSeq(makeSequenceSounds(LENGTH_PER_BLOCK, nextN));
  };

  // Démarre au montage
  useEffect(() => {
    startBlock(1, N);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Boucle principale (un stimulus toutes les INTERVAL_MS)
  useEffect(() => {
    if (!running || !posSeq.length || !sndSeq.length) return;

    // 1) Ouvre la fenêtre de réponse
    respondedPosRef.current = false;
    respondedAudRef.current = false;
    setAwaitingResponse(true);

    // 2) Présente les stimuli
    const currentLetter = sndSeq[index];
    // On parle la lettre au début de la fenêtre
    if (currentLetter) {
      Speech.stop();
      Speech.speak(currentLetter, { language: "fr-FR", pitch: 1.0, rate: 1.0 });
    }

    // 3) Ferme la fenêtre de réponse à la fin de l'intervalle
    timerRef.current = setTimeout(() => {
      setAwaitingResponse(false);

      // VISUEL : si c'était une cible et pas de réponse → miss
      if (isTargetPos && !respondedPosRef.current) {
        setMissesPos((m) => m + 1);
      }
      // AUDITIF : si c'était une cible et pas de réponse → miss
      if (isTargetAud && !respondedAudRef.current) {
        setMissesAud((m) => m + 1);
      }

      // Passage à l'essai suivant ou fin de bloc / de session
      if (index + 1 >= LENGTH_PER_BLOCK) {
        // Fin de bloc → cumule les scores du bloc
        setCum((c) => ({
          hitsPos: c.hitsPos + hitsPos,
          missesPos: c.missesPos + missesPos,
          falsePosPos: c.falsePosPos + falsePosPos,
          correctRejectPos: c.correctRejectPos + correctRejectPos,
          hitsAud: c.hitsAud + hitsAud,
          missesAud: c.missesAud + missesAud,
          falsePosAud: c.falsePosAud + falsePosAud,
          correctRejectAud: c.correctRejectAud + correctRejectAud,
        }));

        // Calcule précisions du bloc pour adaptation
        const posDen = hitsPos + missesPos + falsePosPos + correctRejectPos;
        const audDen = hitsAud + missesAud + falsePosAud + correctRejectAud;
        const posAcc = posDen > 0 ? hitsPos / posDen : 0;
        const audAcc = audDen > 0 ? hitsAud / audDen : 0;

        // Règle d'adaptation de N
        let nextN = N;
        if (posAcc >= 0.8 && audAcc >= 0.8) nextN = Math.min(6, N + 1);
        else if (posAcc <= 0.6 || audAcc <= 0.6) nextN = Math.max(1, N - 1);

        if (block >= BLOCKS) {
          // Fin de la session complète
          setRunning(false);
          setFinished(true);
        } else {
          // Lance le bloc suivant
          setN(nextN);
          startBlock(block + 1, nextN);
        }
      } else {
        setIndex((i) => i + 1);
      }
    }, INTERVAL_MS);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, isTargetPos, isTargetAud, posSeq, sndSeq, hitsPos, missesPos, falsePosPos, correctRejectPos, hitsAud, missesAud, falsePosAud, correctRejectAud]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Réponses utilisateur (séparées)
  const onPressSamePos = () => {
    if (!running || !awaitingResponse) return;
    respondedPosRef.current = true;

    if (isTargetPos) setHitsPos((h) => h + 1);
    else setFalsePosPos((f) => f + 1);
  };

  const onPressSameAud = () => {
    if (!running || !awaitingResponse) return;
    respondedAudRef.current = true;

    if (isTargetAud) setHitsAud((h) => h + 1);
    else setFalsePosAud((f) => f + 1);
  };

  // (Optionnel) Bouton "Différent" par modalité — ici on ne le propose pas,
  // on compte les "rejets corrects" uniquement si tu souhaites un bouton dédié.
  // Pour rester simple en Dual, on ne met que les 2 "Même".
  // Si tu veux, on peut ajouter deux boutons "Différent (position)" / "Différent (son)".

  // Calculs finaux (précisions cumulées)
  const totalPos = cum.hitsPos + cum.missesPos + cum.falsePosPos + cum.correctRejectPos + hitsPos + missesPos + falsePosPos + correctRejectPos;
  const totalAud = cum.hitsAud + cum.missesAud + cum.falsePosAud + cum.correctRejectAud + hitsAud + missesAud + falsePosAud + correctRejectAud;

  const posAcc = totalPos > 0 ? Math.round(((cum.hitsPos + hitsPos) / totalPos) * 100) : 0;
  const audAcc = totalAud > 0 ? Math.round(((cum.hitsAud + hitsAud) / totalAud) * 100) : 0;

  // Rendu grille
  const currentCell = posSeq[index] ?? -1;
  const cells = Array.from({ length: CELLS }, (_, i) => i);

  return (
    <View style={{ flex: 1 }}>
      {/* Fond vert */}
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
          <Text style={styles.title}>Dual N-Back</Text>
          <View style={{ alignItems: "flex-end", width: responsiveWidth(24) }}>
            <View style={styles.badgesRow}>
              <View style={styles.nBadge}><Text style={styles.nText}>N = {N}</Text></View>
              <View style={styles.nBadge}><Text style={styles.nText}>Bloc {block}/{BLOCKS}</Text></View>
            </View>
          </View>
        </View>

        {/* Progression */}
        <Text style={styles.progress}>
          Essai {Math.min(index + 1, LENGTH_PER_BLOCK)} / {LENGTH_PER_BLOCK}
        </Text>

        {/* Grille 3×3 */}
        <View style={[styles.grid, { width: responsiveWidth(70), aspectRatio: 1 }]}>
          {cells.map((i) => {
            const isActive = i === currentCell && awaitingResponse;
            return <View key={i} style={[styles.cell, isActive && styles.cellActive]} />;
          })}
        </View>

        {/* Boutons de réponse */}
        {!finished ? (
          <View style={styles.actionsCol}>
            <Text style={styles.hint}>Réponds pour chaque modalité séparément :</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={onPressSamePos} activeOpacity={0.85} style={[styles.actionBtn, styles.posBtn]}>
                <Text style={styles.actionTxt}>Même position</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressSameAud} activeOpacity={0.85} style={[styles.actionBtn, styles.audBtn]}>
                <Text style={styles.actionTxt}>Même son</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Session terminée 🎯</Text>
            <Text style={styles.resultLine}>Précision visuelle : {posAcc}%</Text>
            <Text style={styles.resultLine}>Précision auditive : {audAcc}%</Text>
            <Text style={styles.resultLineSmall}>
              (N adaptatif a ajusté le niveau en fin de bloc selon tes performances)
            </Text>

            <View style={styles.resultActions}>
              <TouchableOpacity style={styles.restartBtn} onPress={() => { setN(INITIAL_N); startBlock(1, INITIAL_N); setCum({ hitsPos:0, missesPos:0, falsePosPos:0, correctRejectPos:0, hitsAud:0, missesAud:0, falsePosAud:0, correctRejectAud:0 }); }}>
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginTop: responsiveHeight(1),
  },
  backBtn: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 12,
  },
  backTxt: { color: "#0f5132", fontWeight: "600", fontSize: responsiveFontSize(1.9) },
  title: { fontSize: responsiveFontSize(3), fontWeight: "800", color: "#0f5132" },
  badgesRow: { flexDirection: "row", gap: responsiveWidth(1.8) },
  nBadge: {
    backgroundColor: "rgba(255,255,255,0.3)", paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.8), borderRadius: 10,
  },
  nText: { color: "#0f5132", fontWeight: "700", fontSize: responsiveFontSize(1.8) },

  progress: {
    color: "#0f5132", fontSize: responsiveFontSize(2), opacity: 0.9,
    textAlign: "center", marginTop: responsiveHeight(1.5), marginBottom: responsiveHeight(2),
  },

  grid: {
    alignSelf: "center", flexDirection: "row", flexWrap: "wrap",
    gap: responsiveWidth(2.5), marginBottom: responsiveHeight(3),
  },
  cell: {
    width: "30%", aspectRatio: 1, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.45)", borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  cellActive: {
    backgroundColor: "rgba(255,255,255,0.95)", borderColor: "#2ecc71",
    shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8, elevation: 4,
  },

  actionsCol: { alignItems: "center", gap: responsiveHeight(1) },
  hint: { color: "#0f5132", fontSize: responsiveFontSize(1.8), opacity: 0.85 },
  actionsRow: { flexDirection: "row", gap: responsiveWidth(4), justifyContent: "center" },
  actionBtn: {
    paddingVertical: responsiveHeight(1.6), paddingHorizontal: responsiveWidth(5.5),
    borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.45)",
    shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6, elevation: 3,
  },
  posBtn: { backgroundColor: "rgba(52, 152, 219, 0.95)" }, // bleu = spatial
  audBtn: { backgroundColor: "rgba(155, 89, 182, 0.95)" }, // violet = audio
  actionTxt: { color: "#fff", fontWeight: "800", fontSize: responsiveFontSize(2.1) },

  resultBox: { alignItems: "center", gap: responsiveHeight(1), marginTop: responsiveHeight(2) },
  resultTitle: { fontSize: responsiveFontSize(3), fontWeight: "900", color: "#073b27", marginBottom: responsiveHeight(1) },
  resultLine: { fontSize: responsiveFontSize(2.2), color: "#0f5132" },
  resultLineSmall: { fontSize: responsiveFontSize(1.8), color: "#0f5132", opacity: 0.8, marginTop: responsiveHeight(0.6) },
  resultActions: { flexDirection: "row", gap: responsiveWidth(4), marginTop: responsiveHeight(2) },
  restartBtn: {
    backgroundColor: "rgba(255,255,255,0.25)", paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5), borderRadius: 12, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  restartTxt: { color: "#0f5132", fontWeight: "700", fontSize: responsiveFontSize(2) },
});
