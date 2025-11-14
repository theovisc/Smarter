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

export default function NBackLettresTutorialScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(0);

  const slides = [
    {
      image: require("@assets/nback_letters1.jpeg"),
      titleLine: "Tour 1 : Mémorise",
      small: "Une lettre apparaît. Retient bien laquelle ✍️",
    },
    {
      image: require("@assets/nback_letters2.jpeg"),
      titleLine: "Tour 2 : Mémorise",
      small: "Une autre lettre s’affiche. Continue à retenir la séquence.",
    },
    {
      image: require("@assets/nback_letters3.jpeg"),
      titleLine: "Tour 3 : Compare & Réponds",
      small: "Même lettre qu’au Tour 1 → Clique sur « Même (N-Back) » ✅",
    },
    {
      image: require("@assets/nback_letters4.jpeg"),
      titleLine: "Tour 4 : Compare & Réponds",
      small: "Lettre différente du Tour 2 → Clique sur « Différent » ❌",
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
        <Text style={styles.instructions}>Exemple avec N = 2</Text>

        {/* 🖼️ SLIDES */}
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
              style={{
                width,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={s.image}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.slideTextLarge}>{s.titleLine}</Text>
              <Text style={styles.slideTextSmall}>{s.small}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 🔘 Points de pagination */}
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

        {/* ← Retour */}
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
    marginBottom: responsiveHeight(1.5),
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
