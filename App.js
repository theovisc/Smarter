import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import MentalScreen from "./src/screens/MentalScreen"; // tu as déjà ce fichier


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Animations personnalisées */}
        <Stack.Screen
          name="Mental"
          component={MentalScreen}
          options={{ animation: "slide_from_left" }}
        />

        <Stack.Screen
          name="Physique"
          component={() => null}
          options={{ animation: "slide_from_right" }}
        />

        <Stack.Screen
          name="IA"
          component={() => null}
          options={{ animation: "slide_from_bottom" }}
        />

        <Stack.Screen
          name="DailyBoost"
          component={() => null}
          options={{ animation: "fade" }} // effet central
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
