import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// --- IMPORTS SCREENS ---
import HomeScreen from "@screens/HomeScreen";
import MentalScreen from "@screens/Mental/MentalScreen";

import CalculMentalScreen from "@screens/Mental/MentalMath/MentalMathScreen";
import CalculMentalSelectScreen from "@screens/Mental/MentalMath/MentalMathSelectScreen";

import NBackScreen from "@screens/Mental/NBack/Letters/NBackLettersScreen";
import NBackSelectScreen from "@screens/Mental/NBack/NBackSelectScreen";
import NBackVisuelScreen from "@screens/Mental/NBack/Visual/NBackVisualScreen";
import NBackDualScreen from "@screens/Mental/NBack/Dual/NBackDualScreen";
import NBackVisuelTutorialScreen from "@screens/Mental/NBack/Visual/NBackVisualTutorialScreen";
import NBackLettresTutorialScreen from "@screens/Mental/NBack/Letters/NBackLettersTutorialScreen";
import NBackVisuelInfoScreen from "@screens/Mental/NBack/Visual/NBackVisualInfoScreen";
import NBackDualInfoScreen from "@screens/Mental/NBack/Dual/NBackDualInfoScreen";
import NBackInfoScreen from "@screens/Mental/NBack/Letters/NBackLettersInfoScreen";

import WorkScreen from "@screens/Work/WorkScreen";
import TESTScreen from "@screens/TestScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      
      <Stack.Screen name="Home" component={HomeScreen} options={({ route }) => ({ animation: route?.params?.animation || "slide_from_left" })} />

      <Stack.Screen name="Mental" component={MentalScreen} options={{ animation: "slide_from_left" }} />

      <Stack.Screen name="Physical" component={() => null} options={{ animation: "slide_from_right" }} />
      
      <Stack.Screen name="AI" component={() => null} options={{ animation: "slide_from_bottom" }} />
      
      <Stack.Screen name="Evolve" component={() => null} options={{ animation: "fade" }} />
      

      {/* --- MENTAL MATH --- */}
      <Stack.Screen name="CalculMental" component={CalculMentalScreen} />
      <Stack.Screen name="CalculMentalSelect" component={CalculMentalSelectScreen} />

      {/* --- NBACK --- */}
      <Stack.Screen name="NBack" component={NBackScreen} />
      <Stack.Screen name="NBackSelect" component={NBackSelectScreen} />

      <Stack.Screen name="NBackVisuel" component={NBackVisuelScreen} />
      <Stack.Screen name="NBackDual" component={NBackDualScreen} />

      <Stack.Screen name="NBackVisuelTutorial" component={NBackVisuelTutorialScreen} />
      <Stack.Screen name="NBackLettresTutorial" component={NBackLettresTutorialScreen} />

      <Stack.Screen name="NBackVisuelInfo" component={NBackVisuelInfoScreen} />
      <Stack.Screen name="NBackDualInfo" component={NBackDualInfoScreen} />
      <Stack.Screen name="NBackInfo" component={NBackInfoScreen} />

      {/* --- WORK --- */}
      <Stack.Screen name="Work" component={WorkScreen} />

      {/* --- TEST --- */}
      <Stack.Screen name="TEST" component={TESTScreen} />
    </Stack.Navigator>
  );
}
