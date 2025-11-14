import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const { width } = Dimensions.get("window");

export default function NBackVisuelTutorialScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);

  const slides = [
    {
      image: require("@assets/nback_visual1.jpeg"),
      titleLine: "Tour 1 : Mémorise",
      small: "Une case s’allume. Mémorise bien la position 👀",
    },
    {
      image: require("@assets/nback_visual2.jpeg"),
      titleLine: "Tour 2 : Mémorise",
      small: "Une autre case s’allume. Continue à mémoriser.",
    },
    {
      image: require("@assets/nback_visual3.jpeg"),
      titleLine: "Tour 3 : Mémorise et Compare au Tour 1",
      small: "C'est la même case que Tour 1 → Clique sur « Même (N-Back) » ✅",
    },
    {
      image: require("@assets/nback_visual4.jpeg"),
      titleLine: "Tour 4 : Mémorise et Compare au Tour 2",
      small: "C'est une case différente de Tour 2 → Clique sur « Différent » ❌",
    },
  ];

  const handleScroll = (event) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / width);
    setPage(newPage);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🌿 FOND DÉGRADÉ */}
      <LinearGradient
        colors={["#e8f7ee", "#bfead6", "#8fdbba", "#68caa0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Comment jouer ?</Text>
        <Text style={styles.instructions}>Exemple avec <Text style={{ fontWeight: "bold" }}>N = 2</Text></Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {slides.map((s, index) => (
            <View
              key={index}
              style={{ width, alignItems: "center", justifyContent: "center" }}
            >
              <Image
                source={s.image}
                style={styles.image}
                resizeMode="contain"
              />

              {/* Ligne titre */}
              <Text style={styles.slideTextLarge}>{s.titleLine}</Text>

              {/* Petit texte explicatif dessous */}
              <Text style={styles.slideTextSmall}>{s.small}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Petits points d’indication */}
        <View style={styles.dotsContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  opacity: i === page ? 1 : 0.3,
                  transform: [{ scale: i === page ? 1.2 : 1 }],
                },
              ]}
            />
          ))}
        </View>

        {/* Bouton retour */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFontSize(3.4),
    fontWeight: "bold",
    color: "#0f5132",
    marginBottom: responsiveHeight(2.5),
  },
  instructions: {
    fontSize: responsiveFontSize(2.2),
    color: "#0f5132",
    marginBottom: responsiveHeight(1.5),
  },
  image: {
    width: responsiveWidth(80),
    height: responsiveHeight(40),
    marginBottom: responsiveHeight(2),
    borderWidth: 1,
    borderColor: "#0f5132",
    borderRadius: 8,
  },
  slideTextLarge: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: "700",
    color: "#1c3520",
    textAlign: "center",
    width: responsiveWidth(85),
  },
  slideTextSmall: {
    fontSize: responsiveFontSize(2.1),
    color: "#1c3520",
    textAlign: "center",
    width: responsiveWidth(85),
    marginTop: responsiveHeight(0.8),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: responsiveHeight(1.5),
  },
  dot: {
    width: responsiveHeight(1.4),
    height: responsiveHeight(1.4),
    borderRadius: 50,
    backgroundColor: "#0f5132",
    marginHorizontal: 5,
  },
  backButton: {
    marginTop: responsiveHeight(2),
  },
  backText: {
    fontSize: responsiveFontSize(2.2),
    color: "#0f5132",
    fontWeight: "600",
  },
});
