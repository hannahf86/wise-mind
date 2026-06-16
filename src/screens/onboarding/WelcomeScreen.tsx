import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colours,
  fonts,
  fontSizes,
  spacing,
  radius,
  minTouchTarget,
} from "../../theme/theme";

type Props = {
  onNext: () => void;
};

export default function WelcomeScreen({ onNext }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.logoMark}>
          <Ionicons name="leaf-outline" size={48} color={colours.white} />
        </View>
        <Text style={styles.logoTitle}>Wise Mind</Text>
        <Text style={styles.logoTagline}>Your DBT skills, your way.</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.body}>
          Wise Mind is a DBT skills app designed for neurodivergent minds. It's
          here to support you between therapy sessions, help you build emotional
          resilience, and give you tools that actually work for how your brain
          is wired.
        </Text>
        <Text style={styles.body}>
          There's no pressure, no streaks, and no shame. Just skills, at your
          pace.
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onNext}>
        <Text style={styles.btnText}>Get started</Text>
        <Ionicons
          name="arrow-forward-outline"
          size={18}
          color={colours.white}
        />
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Wise Mind is not a crisis service. If you are in immediate danger please
        call 999 or go to your nearest A&E.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: spacing.xl,
    justifyContent: "center",
    gap: spacing.xxl,
  },
  logoArea: {
    alignItems: "center",
    gap: spacing.sm,
  },
  logoMark: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colours.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  logoTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxxl,
    color: colours.teal,
    fontWeight: "700",
  },
  logoTagline: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
  },
  content: {
    gap: spacing.md,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    fontWeight: "700",
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    lineHeight: 24,
  },
  btn: {
    backgroundColor: colours.teal,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: minTouchTarget,
  },
  btnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textLight,
    textAlign: "center",
    lineHeight: 18,
  },
});
