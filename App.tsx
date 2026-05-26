import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          AtkinsonHyperlegible: require("./src/assets/fonts/AtkinsonHyperlegible_Regular.ttf"),
          AtkinsonHyperlegible_Bold: require("./src/assets/fonts/AtkinsonHyperlegible_Bold.ttf"),
          Inter: require("@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf"),
          Inter_Medium: require("@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf"),
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
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
