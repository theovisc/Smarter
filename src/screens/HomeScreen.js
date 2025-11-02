import React, {useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";


export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const adjustedMarginBottom = insets.bottom > 20 ? -10 : 0;
  const bottomSpace = responsiveHeight(12) + insets.bottom;

  // Valeur d’opacité du voile
  const overlayOpacity = useSharedValue(1); // 1 = complètement opaque au début

  // Effet de fondu au démarrage
  useEffect(() => {
    overlayOpacity.value = withTiming(0.35, {
      duration: 2500, // ms
      easing: Easing.out(Easing.quad),
    });
  }, []);

  // Style animé pour le voile
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <View style={{ flex: 1 }}>
      {/* 🎨 FOND D'ÉCRAN DÉGRADÉ */}
      <LinearGradient
        colors={[
          "#43e97b", // vert clair frais
          "#38f9d7", // turquoise (transition douce vers bleu)
          "#1e88e5", // bleu profond (intelligence, IA)
          "#f53844", // rouge énergique
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.65, 0.95]} // proportion du dégradé
        style={StyleSheet.absoluteFillObject}
      />

      {/* Voile blanc animé au-dessus */}
      <Animated.View
        pointerEvents="none"
        style={[styles.startOverlay, overlayStyle]}
      />


      {/* CONTENU PRINCIPAL */}
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "transparent" }]}>
        {/* Bouton Settings */}
        <View style={[styles.settings, {marginTop: insets.top}]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Settings")}
            style={styles.settingsbutton}
          >
            <Text style={styles.settingsText}>⚙️ Paramètres</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.container, { paddingBottom: bottomSpace }]}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>Bonjour, Théo</Text>
            <Text style={styles.subtitle}>
              Deviens une meilleure version de toi-même
            </Text>
          </View>

          {/* Bouton Daily Boost */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("DailyBoost")}
            style={styles.shadowWrapper}
          >
            <LinearGradient
              colors={["#2ecc71", "#e74c3c"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dailyBoost}
            >
              <Text style={styles.DailyBoostText}>Daily Boost</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Remplissage en bas pour écran avec une barre d'iPhone */}
        {insets.bottom > 20 && (
          <View style={[styles.bottomFill, { height: insets.bottom }]} />
        )}

        {/* Bandeau du bas */}
        <View
          style={[
            styles.bottomBar,
            { marginBottom: adjustedMarginBottom },
          ]}
        >
          <TouchableOpacity
            style={[styles.button, styles.mental]}
            onPress={() => navigation.navigate("Mental")}
          >
            <Text style={styles.buttonText}>Mental</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circle}
            onPress={() => navigation.navigate("IA")}
          >
            <Text style={styles.circleText}>IA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.physique]}
            onPress={() => navigation.navigate("Physique")}
          >
            <Text style={styles.buttonText}>Physique</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // fond global
  },

  settings: {
  position: "absolute",
  top: responsiveHeight(2),
  right: responsiveWidth(5),
  },

  settingsbutton: {
    width: responsiveWidth(22),
    height: responsiveHeight(5.2),
    backgroundColor: "rgba(255,255,255,0.25)", // blanc translucide
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)", // léger contour brillant
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5, // ombre Android
    backdropFilter: "blur(10px)", // (optionnel, fonctionne parfois sous iOS)
  },

  settingsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: responsiveFontSize(2),
    textAlign: "center",
  },

  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 1)", // 👈 bien visible au début
  },

  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  textBlock: {
    alignItems: "center",
    marginBottom: responsiveHeight(30), // espace entre texte et Daily Boost
  },

  title: {
    fontSize: responsiveFontSize(4.4),
    fontWeight: "bold",
    color: "#333",
  },

  subtitle: {
    fontSize: responsiveFontSize(2.3),
    color: "#333",
  },

  DailyBoostText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.5),
  },

  dailyBoost: {
    width: responsiveWidth(35),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(2),
    justifyContent: "center",
    alignItems: "center",
  },

  shadowWrapper: {
    shadowColor: "#000000ff",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 10,
    borderRadius: responsiveHeight(2),
  },

  bottomBar: {
    position: "absolute", // 👈 nécessaire pour pouvoir la déplacer librement
    bottom: 0, // collée au bas de l’écran
    width: "100%",
    height: responsiveHeight(12),
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  bottomFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f0f0f0", // même couleur que la barre
  },

  button: {
    width: responsiveWidth(28),
    height: responsiveHeight(6.5),
    borderRadius: responsiveHeight(1.8),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(2.5),
  },

  mental: {
    backgroundColor: "#2ecc71", // vert
  },

  physique: {
    backgroundColor: "#e74c3c", // rouge
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.3),
  },

  circle: {
    width: responsiveHeight(7),
    height: responsiveHeight(7),
    borderRadius: responsiveHeight(3.5),
    backgroundColor: "#1E88E5", // bleu
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(2.5),
  },

  circleText: {
    color: "#fff",
    fontSize: responsiveFontSize(2.3),
    fontWeight: "bold",
  },
});
