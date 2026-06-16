import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
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
  onNext: (reasons: string[]) => void;
};

const OPTIONS = [
  {
    id: "emotions",
    label: "I want to understand my emotions better",
    icon: "heart-outline",
  },
  {
    id: "overwhelm",
    label: "I struggle with overwhelming feelings",
    icon: "thunderstorm-outline",
  },
  {
    id: "relationships",
    label: "I want to build better relationships",
    icon: "people-outline",
  },
  {
    id: "coping",
    label: "I want to learn coping skills",
    icon: "shield-outline",
  },
  {
    id: "therapy",
    label: "I'm supporting my therapy journey",
    icon: "medical-outline",
  },
  {
    id: "crisis",
    label: "I sometimes struggle to keep myself safe",
    icon: "hand-left-outline",
  },
  {
    id: "neurodivergent",
    label: "I want tools designed for how my brain works",
    icon: "bulb-outline",
  },
  {
    id: "curious",
    label: "I'm just curious about DBT",
    icon: "search-outline",
  },
];

export default function WhyHereScreen({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  function toggleOption(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>What brings you here?</Text>
        <Text style={styles.sub}>
          Select everything that feels relevant — there are no wrong answers.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {OPTIONS.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => toggleOption(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={isSelected ? colours.teal : colours.textMid}
              />
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colours.teal}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.btn, selected.length === 0 && styles.btnDisabled]}
        onPress={() => onNext(selected)}
        disabled={selected.length === 0}
      >
        <Text style={styles.btnText}>Continue</Text>
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
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    paddingTop: 52,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    fontWeight: "700",
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    lineHeight: 22,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colours.borderLight,
    minHeight: minTouchTarget,
  },
  optionSelected: {
    borderColor: colours.teal,
    backgroundColor: colours.tealLight,
  },
  optionText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    flex: 1,
    lineHeight: 20,
  },
  optionTextSelected: {
    color: colours.teal,
    fontFamily: fonts.heading,
    fontWeight: "700",
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
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
});
