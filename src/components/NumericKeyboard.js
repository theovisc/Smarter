import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

// Clavier 3x4 : 1 2 3 / 4 5 6 / 7 8 9 / del 0 ok
export default function NumericKeyboard({ onKeyPress }) {
  const keys = [
    "1","2","3",
    "4","5","6",
    "7","8","9",
    "del","0","ok",
  ];

  return (
    <View style={styles.wrap}>
      {keys.map((k) => (
        <TouchableOpacity
          key={k}
          style={[styles.key, k === "ok" ? styles.ok : k === "del" ? styles.del : null]}
          activeOpacity={0.8}
          onPress={() => onKeyPress(k)}
        >
          <Text style={styles.keyText}>
            {k === "del" ? "⌫" : k === "ok" ? "OK" : k}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: responsiveHeight(2),
    gap: responsiveWidth(2),
  },
  key: {
    width: "31%",
    height: responsiveHeight(7.5),
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  keyText: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: "800",
    color: "#0f5132",
  },
  ok: {
    backgroundColor: "rgba(46, 204, 113, 0.9)",
  },
  del: {
    backgroundColor: "rgba(231, 76, 60, 0.9)",
  },
});
