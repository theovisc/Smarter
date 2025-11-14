import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import MentalScreen from "./src/screens/Mental/MentalScreen"; 
import CalculMentalScreen from "./src/screens/Mental/MentalMath/MentalMathScreen";
import CalculMentalSelectScreen from "./src/screens/Mental/MentalMath/MentalMathSelectScreen";
import NBackScreen from "./src/screens/Mental/NBack/NBackScreen";
import WorkScreen from "./src/screens/WorkScreen";
import NBackVisuelScreen from "./src/screens/Mental/NBack/NBackVisuelScreen";
import NBackDualScreen from "./src/screens/Mental/NBack/NBackDualScreen";
import TESTScreen from "./src/screens/TESTScreen";
import NBackSelectScreen from "./src/screens/Mental/NBack/NBackSelectScreen";
import NBackVisuelInfoScreen from "./src/screens/Mental/NBack/NBackVisuelInfoScreen";
import NBackDualInfoScreen from "./src/screens/Mental/NBack/NBackDualInfoScreen";
import NBackInfoScreen from "./src/screens/Mental/NBack/NBackInfoScreen";
import NBackVisuelTutorialScreen from "./src/screens/Mental/NBack/NBackVisuelTutorialScreen";
import NBackLettresTutorialScreen from "./src/screens/Mental/NBack/NBackTutorialScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Home"
      >

        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ route }) => ({
            animation: route?.params?.animation || "slide_from_left",
          })} 
        />

        <Stack.Screen name="NBackVisuelTutorial" component={NBackVisuelTutorialScreen} />

        <Stack.Screen name="NBackLettresTutorial" component={NBackLettresTutorialScreen} />
        
        <Stack.Screen name="NBackSelect" component={NBackSelectScreen} />

        <Stack.Screen name="NBackVisuelInfo" component={NBackVisuelInfoScreen} />

        <Stack.Screen name="NBackDualInfo" component={NBackDualInfoScreen} />

        <Stack.Screen name="NBackInfo" component={NBackInfoScreen} />

        <Stack.Screen name="Work" component={WorkScreen} />

        <Stack.Screen name="NBackDual" component={NBackDualScreen} />

        <Stack.Screen name="NBackVisuel" component={NBackVisuelScreen} />
        
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

        <Stack.Screen
        name="CalculMentalSelect"
        component={CalculMentalSelectScreen}
        />

        <Stack.Screen
          name="CalculMental"
          component={CalculMentalScreen}
        />

        <Stack.Screen name="NBack" component={NBackScreen} />

        <Stack.Screen name="TEST" component={TESTScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
