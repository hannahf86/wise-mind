import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
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
import {
  addFavouriteSkill,
  removeFavouriteSkill,
  getFavouriteSkills,
} from "../services/favourites";

const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  content: string;
  reflect_prompt: string;
  duration_minutes: number;
  order_index: number;
};

type Module = {
  id: string;
  name: string;
  colour: string;
  icon: string;
};

type Props = {
  lesson: Lesson;
  module: Module;
  onBack: () => void;
  onComplete: () => void;
  onSaveForLater: (lessonId: string) => void;
  skillId?: string;
};

export default function LessonScreen({
  lesson,
  module,
  onBack,
  onComplete,
  onSaveForLater,
  skillId,
}: Props) {
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [reflectionError, setReflectionError] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [favFeedback, setFavFeedback] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (skillId) checkFavourited();
  }, []);

  async function checkFavourited() {
    const favs = await getFavouriteSkills(DEV_USER_ID);
    setIsFavourited(favs.some((f) => f.skill_id === skillId));
  }

  async function handleToggleFavourite() {
    if (!skillId) return;
    if (isFavourited) {
      await removeFavouriteSkill(DEV_USER_ID, skillId);
      setIsFavourited(false);
      showFavFeedback("Removed from favourites");
    } else {
      const result = await addFavouriteSkill(DEV_USER_ID, skillId);
      if (result.reason === "max_reached") {
        showFavFeedback("You already have 5 favourites — remove one first");
      } else {
        setIsFavourited(true);
        showFavFeedback("Added to favourites");
      }
    }
  }

  function showFavFeedback(message: string) {
    setFavFeedback(message);
    setTimeout(() => setFavFeedback(null), 2500);
  }

  function handleSaveForLater() {
    onSaveForLater(lesson.id);
    onBack();
  }

  async function handleComplete() {
    if (!reflection.trim()) {
      setReflectionError(true);
      setTimeout(() => setReflectionError(false), 2000);
      return;
    }
    setSaving(true);
    await saveJournalEntry(
      DEV_USER_ID,
      "reflection",
      reflection.trim(),
      false,
      lesson.title,
      undefined, // lesson.id is not a real UUID yet — TODO: wire up real lesson IDs
    );
    setSaving(false);
    setCompleted(true);
  }

  if (completed) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: module.colour }]}>
          <View style={{ width: 44 }} />
          <Text style={styles.headerModule}>{module.name}</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.completedScreen}>
          <View
            style={[
              styles.completedIcon,
              { backgroundColor: module.colour + "20" },
            ]}
          >
            <Ionicons name="checkmark-circle" size={64} color={module.colour} />
          </View>
          <Text style={styles.completedTitle}>Lesson complete!</Text>
          <Text style={styles.completedSub}>
            Your reflection has been saved to your journal.
          </Text>

          {skillId && (
            <View style={styles.favouriteSection}>
              <Text style={styles.favouritePrompt}>
                Want to add this skill to your favourites?
              </Text>
              <TouchableOpacity
                style={[
                  styles.favouriteBtn,
                  isFavourited && styles.favouriteBtnActive,
                ]}
                onPress={handleToggleFavourite}
              >
                <Ionicons
                  name={isFavourited ? "star" : "star-outline"}
                  size={20}
                  color={isFavourited ? colours.white : colours.teal}
                />
                <Text
                  style={[
                    styles.favouriteBtnText,
                    isFavourited && styles.favouriteBtnTextActive,
                  ]}
                >
                  {isFavourited ? "Added to favourites" : "Add to favourites"}
                </Text>
              </TouchableOpacity>
              {favFeedback && (
                <Text style={styles.favFeedbackText}>{favFeedback}</Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: module.colour }]}
            onPress={onComplete}
          >
            <Text style={styles.doneBtnText}>Back to lessons</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: module.colour }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back-outline" size={20} color={colours.white} />
        </TouchableOpacity>
        <Text style={styles.headerModule} numberOfLines={1}>
          {module.name}
        </Text>
        {skillId ? (
          <TouchableOpacity
            style={styles.starBtn}
            onPress={handleToggleFavourite}
          >
            <Ionicons
              name={isFavourited ? "star" : "star-outline"}
              size={20}
              color={colours.white}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* Favourite feedback banner */}
      {favFeedback && (
        <View style={styles.favFeedback}>
          <Text style={styles.favFeedbackText}>{favFeedback}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Skill image placeholder */}
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: module.colour + "30" },
          ]}
        >
          <Ionicons name={module.icon as any} size={48} color={module.colour} />
          <Text style={[styles.imagePlaceholderText, { color: module.colour }]}>
            Image coming soon
          </Text>
        </View>

        {/* Title and meta */}
        <View style={styles.titleSection}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.metaRow}>
            <View
              style={[
                styles.moduleTag,
                { backgroundColor: module.colour + "20" },
              ]}
            >
              <Text style={[styles.moduleTagText, { color: module.colour }]}>
                {module.name}
              </Text>
            </View>
            <View style={styles.metaDot} />
            <Ionicons name="time-outline" size={12} color={colours.textMid} />
            <Text style={styles.metaText}>{lesson.duration_minutes} mins</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <Text style={styles.content}>{lesson.content}</Text>

        {/* Reflect section */}
        <View style={styles.reflectSection}>
          <View style={styles.reflectTitleRow}>
            <Ionicons name="bulb-outline" size={16} color={colours.teal} />
            <Text style={styles.reflectTitle}>Reflect</Text>
          </View>
          <Text style={styles.reflectPrompt}>{lesson.reflect_prompt}</Text>
          <Text style={styles.reflectHint}>
            You need to write a reflection to complete this lesson — but you can
            save it for later and come back.
          </Text>

          <TextInput
            style={[
              styles.reflectInput,
              reflectionError && styles.reflectInputError,
            ]}
            placeholder="Write your reflection here..."
            placeholderTextColor={colours.textPlaceholder}
            value={reflection}
            onChangeText={setReflection}
            multiline
            textAlignVertical="top"
          />

          {reflectionError && (
            <Text style={styles.errorText}>
              Please write a reflection to mark this lesson as complete
            </Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveForLater}>
            <Ionicons name="bookmark-outline" size={16} color={colours.teal} />
            <Text style={styles.saveBtnText}>Save for later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.completeBtn, { backgroundColor: module.colour }]}
            onPress={handleComplete}
            disabled={saving}
          >
            <Ionicons
              name="checkmark-outline"
              size={16}
              color={colours.white}
            />
            <Text style={styles.completeBtnText}>
              {saving ? "Saving..." : "Mark as complete"}
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  headerModule: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.white,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  starBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  favFeedback: {
    backgroundColor: colours.tealLight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colours.borderLight,
  },
  favFeedbackText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.tealDark,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 16 / 9,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  imagePlaceholderText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
  },
  titleSection: {
    padding: spacing.xl,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  lessonTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    fontWeight: "700",
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  moduleTag: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
  },
  moduleTagText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colours.lightGrey,
  },
  metaText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
  },
  divider: {
    height: 0.5,
    backgroundColor: colours.borderLight,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  content: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    lineHeight: 26,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  reflectSection: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  reflectTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  reflectTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.teal,
    fontWeight: "700",
  },
  reflectPrompt: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    lineHeight: 22,
  },
  reflectHint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textLight,
    lineHeight: 18,
  },
  reflectInput: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    lineHeight: 24,
    minHeight: 120,
  },
  reflectInputError: {
    borderColor: colours.warning,
    borderWidth: 1.5,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.warning,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  saveBtn: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minHeight: minTouchTarget,
    borderWidth: 1.5,
    borderColor: colours.teal,
    backgroundColor: colours.white,
  },
  saveBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.teal,
    fontWeight: "700",
  },
  completeBtn: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    minHeight: minTouchTarget,
  },
  completeBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.white,
    fontWeight: "700",
  },
  completedScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.xl,
  },
  completedIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  completedTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxxl,
    color: colours.textDark,
    fontWeight: "700",
    textAlign: "center",
  },
  completedSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    textAlign: "center",
    lineHeight: 22,
  },
  favouriteSection: {
    alignItems: "center",
    gap: spacing.md,
    width: "100%",
  },
  favouritePrompt: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    textAlign: "center",
  },
  favouriteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colours.teal,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colours.white,
    minHeight: minTouchTarget,
  },
  favouriteBtnActive: {
    backgroundColor: colours.teal,
    borderColor: colours.teal,
  },
  favouriteBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.teal,
    fontWeight: "700",
  },
  favouriteBtnTextActive: {
    color: colours.white,
  },
  doneBtn: {
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: minTouchTarget,
    width: "100%",
  },
  doneBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
});
