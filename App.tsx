import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/services/AuthContext";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Body — Atkinson Hyperlegible
          AtkinsonHyperlegible: require("./src/assets/fonts/AtkinsonHyperlegible_Regular.ttf"),
          AtkinsonHyperlegible_Bold: require("./src/assets/fonts/AtkinsonHyperlegible_Bold.ttf"),
          // Kept loaded so any legacy screen still referencing "Inter" keeps rendering.
          Inter: require("@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
          Inter_Medium: require("@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf"),
          // Headings — Poppins (run: npx expo install @expo-google-fonts/poppins)
          Poppins_400Regular: require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf"),
          Poppins_500Medium: require("@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf"),
          Poppins_600SemiBold: require("@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf"),
          Poppins_700Bold: require("@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf"),
        });
        setFontsLoaded(true);
      } catch (e: any) {
        setError(e.message);
      }
    }
    loadFonts();
  }, []);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
