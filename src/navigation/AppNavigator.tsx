// 1. Imports
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { colours, fonts, fontSizes } from "../theme/theme";
import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// Screens
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import ToolkitScreen from "../screens/ToolkitScreen";
import JournalScreen from "../screens/JournalScreen";
import ProfileScreen from "../screens/ProfileScreen";

function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

// const insets = useSafeAreaInsets();

// Main navigator function
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colours.white,
            borderTopColor: colours.borderLight,
            borderTopWidth: 0.5,
            paddingBottom: 40,
            paddingTop: 10,
            height: 100,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.body,
            fontSize: fontSizes.xs,
          },
          tabBarActiveTintColor: colours.teal,
          tabBarInactiveTintColor: colours.lightGrey,
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Home: "home-outline",
              Learn: "book-outline",
              Toolkit: "construct-outline",
              Journal: "journal-outline",
              Profile: "person-outline",
            };
            return (
              <Ionicons name={icons[route.name]} size={22} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Learn" component={LearnScreen} />
        <Tab.Screen name="Toolkit" component={ToolkitScreen} />
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Styles at the bottom
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "AtkinsonHyperlegible",
    fontSize: fontSizes.xxl,
    color: colours.teal,
  },
});
