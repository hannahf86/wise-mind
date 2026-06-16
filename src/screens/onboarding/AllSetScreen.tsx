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
  onDone: () => void;
};

export default function AllSetScreen({ onDone }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={72} color={colours.teal} />
        </View>
        <Text style={styles.heading}>You're all set</Text>
        <Text style={styles.body}>
          Wise Mind is ready for you. Start with Module 1 — Mindfulness —
          whenever you're ready. There's no rush.
        </Text>
        <Text style={styles.body}>
          Remember — STOP and TIPP are already in your toolkit if you need them
          right now.
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onDone}>
        <Text style={styles.btnText}>Let's go</Text>
        <Ionicons
          name="arrow-forward-outline"
          size={18}
          color={colours.white}
        />
      </TouchableOpacity>
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
  content: {
    alignItems: "center",
    gap: spacing.lg,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colours.tealLight,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxxl,
    color: colours.textDark,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    lineHeight: 24,
    textAlign: "center",
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
});
