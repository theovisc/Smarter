// src/utils/textStyles.js

import { responsiveFontSize } from "react-native-responsive-dimensions";
import { colors } from "./theme";

export const textStyles = {
  title: {
    fontSize: responsiveFontSize(4.4),
    fontWeight: "bold",
    color: colors.white,
  },
  subtitle: {
    fontSize: responsiveFontSize(2.4),
    color: colors.lightText,
  },
  sectionTitle: {
    fontSize: responsiveFontSize(3.4),
    fontWeight: "600",
    color: colors.white,
  },
  body: {
    fontSize: responsiveFontSize(2),
    color: colors.lightText,
  },
};
