import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
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
import {
  saveJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "../services/journal";

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
    type: "diary_card",
    label: "Diary card",
    icon: "clipboard-outline",
    colour: colours.emotionRegulation,
    prompt: "Which DBT skills did you use today? How did they help?",
  },
  {
    type: "sos_log",
    label: "SOS log",
    icon: "shield-outline",
    colour: colours.interpersonal,
    prompt: "What happened? What skills did you use to get through it?",
  },
];

type Props = {
  onClose: () => void;
  existingEntry?: {
    id: string;
    entry_type: string;
    title?: string;
    content: string;
    share_with_therapist: boolean;
  };
};

export default function NewEntryScreen({ onClose, existingEntry }: Props) {
  const isEditing = !!existingEntry;

  const [selectedType, setSelectedType] = useState<EntryType | null>(
    (existingEntry?.entry_type as EntryType) || null,
  );
  const [title, setTitle] = useState(existingEntry?.title || "");
  const [content, setContent] = useState(existingEntry?.content || "");
  const [sharedWithTherapist, setSharedWithTherapist] = useState(
    existingEntry?.share_with_therapist || false,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const currentType = ENTRY_TYPES.find((t) => t.type === selectedType);

  async function handleSave() {
    if (!selectedType || !content.trim()) return;
    setSaving(true);

    let result;
    if (isEditing && existingEntry) {
      result = await updateJournalEntry(
        existingEntry.id,
        content.trim(),
        sharedWithTherapist,
        title.trim() || undefined,
      );
    } else {
      result = await saveJournalEntry(
        DEV_USER_ID,
        selectedType,
        content.trim(),
        sharedWithTherapist,
        title.trim() || undefined,
      );
    }

    setSaving(false);
    if (result) {
      setSaved(true);
      setTimeout(() => onClose(), 1500);
    }
  }

  function handleDelete() {
    Alert.alert(
      "Delete entry",
      "Are you sure you want to delete this entry? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (existingEntry) {
              await deleteJournalEntry(existingEntry.id);
              onClose();
            }
          },
        },
      ],
    );
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
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit entry" : "New entry"}
        </Text>
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
        {/* Title input */}
        <TextInput
          style={styles.titleInput}
          placeholder="Entry title (optional)"
          placeholderTextColor={colours.textPlaceholder}
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        {/* Entry type picker */}
        <Text style={styles.sectionLabel}>What kind of entry is this?</Text>
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
              disabled={isEditing}
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

        <Text style={styles.typeHint}>
          Choose a category before writing your entry
        </Text>

        {/* Prompt */}
        {currentType && (
          <View style={styles.promptBanner}>
            <Ionicons name="bulb-outline" size={13} color={colours.teal} />
            <Text style={styles.promptText}>{currentType.prompt}</Text>
          </View>
        )}

        {/* Text input */}
        <TextInput
          style={[styles.textInput, categoryError && styles.textInputError]}
          placeholder={
            selectedType
              ? "Start writing..."
              : "Choose a category above to get started"
          }
          placeholderTextColor={colours.textPlaceholder}
          value={content}
          onChangeText={setContent}
          multiline
          editable={!!selectedType}
          textAlignVertical="top"
          onPressIn={() => {
            if (!selectedType) {
              setCategoryError(true);
              setTimeout(() => setCategoryError(false), 2000);
            }
          }}
        />

        {categoryError && (
          <Text style={styles.categoryErrorText}>
            Please select a category above before writing
          </Text>
        )}

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

        {/* Delete button — only shown when editing */}
        {isEditing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={16} color={colours.danger} />
            <Text style={styles.deleteBtnText}>Delete entry</Text>
          </TouchableOpacity>
        )}
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
  saveBtnSaved: {
    backgroundColor: colours.white,
  },
  saveBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  saveBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.white,
    fontWeight: "700",
  },
  saveBtnTextSaved: {
    color: colours.teal,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.lg,
    paddingBottom: 48,
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
  typeHint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: -spacing.xs,
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
  textInputError: {
    borderColor: colours.warning,
    borderWidth: 1.5,
  },
  categoryErrorText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.warning,
    marginTop: -spacing.xs,
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
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.dangerLight,
    backgroundColor: colours.dangerLight,
    minHeight: minTouchTarget,
  },
  deleteBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.danger,
    fontWeight: "700",
  },
});
