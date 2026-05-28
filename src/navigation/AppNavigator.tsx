import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, ActivityIndicator } from "react-native";
import { colours, fonts, fontSizes } from "../theme/theme";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "../screens/HomeScreen";
import LearnScreen from "../screens/LearnScreen";
import ToolkitScreen from "../screens/ToolkitScreen";
import JournalScreen from "../screens/JournalScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import DistractMeScreen from "../screens/DistractMeScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  // const { session, loading } = useAuth(); // TODO: restore before beta
  const session = true;
  const loading = false;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colours.background,
        }}
      >
        <ActivityIndicator color={colours.teal} size="large" />
      </View>
    );
  }

  if (!session) {
    return <SignInScreen />;
  }

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
          tabBarIcon: ({ color }) => {
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
