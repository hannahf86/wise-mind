import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
} from "../theme/theme";
import { saveJournalEntry } from "../services/journal";

const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";

type EntryType = "reflection" | "diary_card" | "sos_log" | "gratitude";

const ENTRY_TYPES: {
  type: EntryType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colour: string;
  prompt: string;
}[] = [
  {
    type: "diary_card",
    label: "Diary Card",
    icon: "clipboard-outline",
    colour: colours.emotionRegulation,
    prompt: "Which DBT skills did you use today? How did they help?",
  },
  {
    type: "reflection",
    label: "Reflection",
    icon: "book-outline",
    colour: colours.mindfulness,
    prompt:
      "What are you noticing right now — in your thoughts, feelings or body?",
  },
  {
    type: "gratitude",
    label: "Gratitude",
    icon: "heart-outline",
    colour: colours.distressTolerance,
    prompt: "What three things are you grateful for today, however small?",
  },

  {
    type: "sos_log",
    label: "SOS Log",
    icon: "shield-outline",
    colour: colours.interpersonal,
    prompt: "What happened? What skills did you use to get through it?",
  },
];

type Props = {
  onClose: () => void;
};

export default function NewEntryScreen({ onClose }: Props) {
  const [selectedType, setSelectedType] = useState<EntryType | null>(null);
  const [content, setContent] = useState("");
  const [sharedWithTherapist, setSharedWithTherapist] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("");

  const currentType = ENTRY_TYPES.find((t) => t.type === selectedType);

  async function handleSave() {
    if (!selectedType || !content.trim()) return;
    setSaving(true);
    const result = await saveJournalEntry(
      DEV_USER_ID,
      selectedType,
      content.trim(),
      sharedWithTherapist,
      title.trim() || undefined,
    );
    setSaving(false);
    if (result) {
      setSaved(true);
      // Show 'saved' state briefly then close
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-outline" size={24} color={colours.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New entry</Text>

        {/* Save button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            (!selectedType || !content.trim()) && styles.saveBtnDisabled,
            saved && styles.saveBtnSaved,
          ]}
          onPress={handleSave}
          disabled={!selectedType || !content.trim() || saving || saved}
        >
          <View style={styles.saveBtnInner}>
            {saved && (
              <Ionicons
                name="checkmark-outline"
                size={14}
                color={colours.teal}
              />
            )}
            <Text
              style={[styles.saveBtnText, saved && styles.saveBtnTextSaved]}
            >
              {saving ? "Saving..." : saved ? "Saved" : "Save"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Entry type picker */}
        <Text style={styles.sectionLabel}>
          Select a category before writing
        </Text>
        <View style={styles.typeGrid}>
          {ENTRY_TYPES.map((type) => (
            <TouchableOpacity
              key={type.type}
              style={[
                styles.typeChip,
                selectedType === type.type && {
                  borderColor: type.colour,
                  backgroundColor: type.colour + "18",
                },
              ]}
              onPress={() => setSelectedType(type.type)}
            >
              <Ionicons
                name={type.icon}
                size={16}
                color={
                  selectedType === type.type ? type.colour : colours.textMid
                }
              />
              <Text
                style={[
                  styles.typeChipText,
                  selectedType === type.type && { color: type.colour },
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Entry title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Prompt */}
        {currentType && (
          <View style={styles.promptBanner}>
            <Ionicons name="bulb-outline" size={13} color={colours.teal} />
            <Text style={styles.promptText}>{currentType.prompt}</Text>
          </View>
        )}

        {/* Text input */}
        <TextInput
          style={styles.textInput}
          placeholder={
            selectedType
              ? "Start writing..."
              : "Choose an entry type above to get started"
          }
          placeholderTextColor={colours.textPlaceholder}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus={!!selectedType}
          editable={!!selectedType}
          textAlignVertical="top"
        />

        {/* Share with therapist */}
        <TouchableOpacity
          style={styles.shareRow}
          onPress={() => setSharedWithTherapist(!sharedWithTherapist)}
        >
          <View style={styles.shareLeft}>
            <Ionicons
              name="medical-outline"
              size={16}
              color={sharedWithTherapist ? colours.teal : colours.lightGrey}
            />
            <View>
              <Text style={styles.shareTitle}>Share with therapist</Text>
              <Text style={styles.shareSub}>
                Your therapist will be able to see this entry
              </Text>
            </View>
          </View>
          <View style={[styles.toggle, sharedWithTherapist && styles.toggleOn]}>
            <View
              style={[
                styles.toggleThumb,
                sharedWithTherapist && styles.toggleThumbOn,
              ]}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  header: {
    backgroundColor: colours.teal,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: colours.white,
    fontWeight: "700",
  },
  saveBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.white,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: 48,
  },
  sectionLabel: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colours.borderLight,
    minHeight: minTouchTarget,
  },
  typeChipText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.textMid,
    fontWeight: "700",
  },
  promptBanner: {
    backgroundColor: colours.tealLight,
    borderRadius: radius.sm,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    borderLeftWidth: 2.5,
    borderLeftColor: colours.teal,
  },
  promptText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.tealDark,
    lineHeight: 20,
    flex: 1,
  },
  textInput: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    lineHeight: 24,
    minHeight: 200,
  },
  shareRow: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    minHeight: minTouchTarget,
  },
  shareLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  shareTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.textDark,
    fontWeight: "700",
  },
  shareSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colours.borderLight,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: colours.teal,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colours.white,
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },
  saveBtnSaved: {
    backgroundColor: colours.white,
  },
  saveBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  saveBtnTextSaved: {
    color: colours.teal,
  },
  typeHint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: -spacing.xs,
  },
  titleInput: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    padding: spacing.lg,
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.textDark,
    minHeight: minTouchTarget,
    fontWeight: "700",
  },
});
