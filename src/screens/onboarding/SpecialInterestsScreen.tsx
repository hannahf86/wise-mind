import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { supabase } from "../../services/supabase";

const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";

type Props = {
  onNext: () => void;
};

export default function SpecialInterestsScreen({ onNext }: Props) {
  const [interests, setInterests] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  function handleAdd() {
    if (!input.trim()) return;
    setInterests((prev) => [...prev, input.trim()]);
    setInput("");
  }

  function handleRemove(index: number) {
    setInterests((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleContinue() {
    if (interests.length === 0) return;
    setSaving(true);

    // Save all interests to Supabase
    const inserts = interests.map((name, index) => ({
      user_id: DEV_USER_ID,
      name,
      emoji: "⭐",
      order_index: index,
    }));

    await supabase.from("special_interests").insert(inserts);

    // Mark onboarding as complete
    await supabase.from("user_settings").upsert({
      user_id: DEV_USER_ID,
      setting_key: "onboarding_complete",
      setting_value: "true",
    });

    setSaving(false);
    onNext();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your special interests</Text>
        <Text style={styles.sub}>
          What are you passionate about? What could you talk about for hours?
        </Text>

        {/* Explanation banner */}
        <View style={styles.explainerBanner}>
          <Ionicons name="sparkles-outline" size={16} color={colours.teal} />
          <View style={styles.explainerText}>
            <Text style={styles.explainerTitle}>How this helps you</Text>
            <Text style={styles.explainerBody}>
              When you're feeling overwhelmed, Wise Mind's Distract Me feature
              will have a friendly chat with you about something you love. It's
              a proven way to regulate your nervous system — and it works best
              when it's about something that genuinely lights you up.
            </Text>
            <Text style={styles.explainerBody}>
              You can always add, change or remove your interests later in your
              profile settings.
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add input */}
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Norse mythology, cats, F1..."
            placeholderTextColor={colours.textPlaceholder}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addBtn, !input.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!input.trim()}
          >
            <Ionicons name="add-outline" size={22} color={colours.white} />
          </TouchableOpacity>
        </View>

        {/* Interests list */}
        {interests.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Add at least one interest to continue
            </Text>
          </View>
        ) : (
          interests.map((interest, index) => (
            <View key={index} style={styles.interestChip}>
              <Ionicons name="star-outline" size={16} color={colours.teal} />
              <Text style={styles.interestText}>{interest}</Text>
              <TouchableOpacity onPress={() => handleRemove(index)}>
                <Ionicons
                  name="close-outline"
                  size={18}
                  color={colours.lightGrey}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.btn,
          (interests.length === 0 || saving) && styles.btnDisabled,
        ]}
        onPress={handleContinue}
        disabled={interests.length === 0 || saving}
      >
        <Text style={styles.btnText}>{saving ? "Saving..." : "Continue"}</Text>
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
    gap: spacing.lg,
  },
  header: {
    gap: spacing.md,
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
  explainerBanner: {
    backgroundColor: colours.tealLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colours.teal,
  },
  explainerText: {
    flex: 1,
    gap: spacing.sm,
  },
  explainerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.teal,
    fontWeight: "700",
  },
  explainerBody: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.tealDark,
    lineHeight: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  addRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    minHeight: minTouchTarget,
  },
  addBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radius.sm,
    backgroundColor: colours.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  empty: {
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textLight,
  },
  interestChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colours.teal,
    minHeight: minTouchTarget,
  },
  interestText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
    flex: 1,
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
