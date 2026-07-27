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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  // Total lessons in the module — drives the lesson-position indicator.
  lessonCount?: number;
};

export default function LessonScreen({
  lesson,
  module,
  onBack,
  onComplete,
  onSaveForLater,
  skillId,
  lessonCount,
}: Props) {
  const insets = useSafeAreaInsets();
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
        showFavFeedback("You already have 5 favourites - remove one first");
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

  // Lesson-position indicator (NOT a reading-progress bar): which lesson in the module.
  const showProgress = typeof lessonCount === "number" && lessonCount > 0;
  const progressPct = showProgress
    ? Math.max(0, Math.min(1, lesson.order_index / (lessonCount as number))) *
      100
    : 0;

  // ---- Completion screen ----
  if (completed) {
    return (
      <View style={styles.container}>
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onComplete}
            accessibilityLabel="Back to lessons"
          >
            <Ionicons name="arrow-back" size={24} color={colours.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.completedScreen}>
          <View style={styles.completedIcon}>
            <Ionicons
              name="checkmark-circle"
              size={72}
              color={colours.jade}
            />
          </View>
          <Text style={styles.completedTitle}>Lesson complete</Text>
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
                  color={isFavourited ? colours.white : colours.jade}
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
        </View>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom + spacing.md },
          ]}
        >
          <TouchableOpacity
            style={styles.completeBtn}
            onPress={onComplete}
          >
            <Text style={styles.completeBtnText}>Back to lessons</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---- Lesson screen ----
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Top bar - back arrow only, on the plain canvas */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={colours.textDark} />
        </TouchableOpacity>
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
        {/* Module pill + duration */}
        <View style={styles.metaRow}>
          <View
            style={[
              styles.modulePill,
              { backgroundColor: module.colour + "1A" },
            ]}
          >
            <Ionicons
              name={module.icon as any}
              size={14}
              color={module.colour}
            />
            <Text style={[styles.modulePillText, { color: module.colour }]}>
              {module.name}
            </Text>
          </View>
          <Text style={styles.durationText}>
            {lesson.duration_minutes} min
          </Text>
        </View>

        {/* Lesson-position indicator */}
        {showProgress && (
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View
                style={[styles.progressFill, { width: `${progressPct}%` }]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {lesson.order_index} / {lessonCount}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.lessonTitle}>{lesson.title}</Text>

        {/* Content card */}
        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{lesson.content}</Text>
        </View>

        {/* Reflect card */}
        <View style={styles.reflectCard}>
          <View style={styles.reflectTitleRow}>
            <Ionicons name="bulb-outline" size={18} color={colours.jade} />
            <Text style={styles.reflectTitle}>Reflect</Text>
          </View>
          <Text style={styles.reflectPrompt}>{lesson.reflect_prompt}</Text>
          <Text style={styles.reflectHint}>
            Writing a reflection completes this lesson - or save it and come
            back later.
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
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}
      >
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveForLater}>
          <Ionicons name="bookmark-outline" size={18} color={colours.jade} />
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completeBtn}
          onPress={handleComplete}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle" size={20} color={colours.white} />
          <Text style={styles.completeBtnText}>
            {saving ? "Saving..." : "Mark as complete"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const cardShadow = {
  shadowColor: "#1C3830",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -spacing.sm,
  },
  favFeedback: {
    backgroundColor: colours.softMint,
    marginHorizontal: spacing.xl,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  favFeedbackText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.jade,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  modulePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  modulePillText: {
    fontFamily: fonts.headingMedium,
    fontSize: fontSizes.sm,
  },
  durationText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: -spacing.sm,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: colours.borderLight,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colours.jadeMid,
  },
  progressLabel: {
    fontFamily: fonts.headingBold,
    fontSize: fontSizes.sm,
    color: colours.jade,
  },
  lessonTitle: {
    fontFamily: fonts.headingBold,
    fontSize: fontSizes.xxxl,
    color: colours.textDark,
    lineHeight: 40,
    marginTop: -spacing.xs,
  },
  contentCard: {
    backgroundColor: colours.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.borderCard,
    padding: spacing.xl,
    ...cardShadow,
  },
  contentText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textBody,
    lineHeight: 26,
  },
  reflectCard: {
    backgroundColor: colours.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.borderCard,
    padding: spacing.xl,
    gap: spacing.md,
    ...cardShadow,
  },
  reflectTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  reflectTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.jade,
  },
  reflectPrompt: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textBody,
    lineHeight: 24,
  },
  reflectHint: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textSecondary,
    lineHeight: 18,
  },
  reflectInput: {
    backgroundColor: colours.mint50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colours.borderInput,
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
  bottomBar: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colours.borderLight,
    backgroundColor: colours.background,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: minTouchTarget + 4,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colours.jade,
    backgroundColor: colours.card,
  },
  saveBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.jade,
  },
  completeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: minTouchTarget + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colours.jade,
  },
  completeBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.white,
  },
  completedScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  completedIcon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.softMint,
  },
  completedTitle: {
    fontFamily: fonts.headingBold,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    textAlign: "center",
  },
  completedSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textBody,
    textAlign: "center",
    lineHeight: 24,
  },
  favouriteSection: {
    alignItems: "center",
    gap: spacing.md,
    width: "100%",
    marginTop: spacing.md,
  },
  favouritePrompt: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textBody,
    textAlign: "center",
  },
  favouriteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colours.jade,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colours.card,
    minHeight: minTouchTarget,
  },
  favouriteBtnActive: {
    backgroundColor: colours.jade,
    borderColor: colours.jade,
  },
  favouriteBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.jade,
  },
  favouriteBtnTextActive: {
    color: colours.white,
  },
});
