import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
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
import LessonScreen from "./LessonScreen";

export default function LearnScreen() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [startedLessons, setStartedLessons] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );

  const mindfulnessModule = {
    id: "c6eabef4-d24e-4fee-a2fa-812b6dc53add",
    name: "Mindfulness",
    colour: colours.mindfulness,
    icon: "leaf-outline",
  };

  function openLesson(
    lessonId: string,
    title: string,
    content: string,
    reflectPrompt: string,
    duration: number,
    order: number,
    skillId?: string,
  ) {
    setSelectedLesson({
      id: lessonId,
      module_id: mindfulnessModule.id,
      title,
      content,
      reflect_prompt: reflectPrompt,
      duration_minutes: duration,
      order_index: order,
      skill_id: skillId,
    });
    setSelectedModule(mindfulnessModule);
  }

  function getLessonTrailingIcon(
    lessonId: string,
    defaultIcon: keyof typeof Ionicons.glyphMap,
    defaultColour: string,
  ) {
    if (completedLessons.has(lessonId)) {
      return (
        <Ionicons name="checkmark-circle" size={18} color={colours.teal} />
      );
    }
    if (startedLessons.has(lessonId)) {
      return (
        <View style={styles.startedBadge}>
          <Ionicons name="pencil-outline" size={12} color={colours.warning} />
        </View>
      );
    }
    return <Ionicons name={defaultIcon} size={18} color={defaultColour} />;
  }

  return (
    <>
      <Modal
        visible={!!selectedLesson}
        animationType="slide"
        onRequestClose={() => setSelectedLesson(null)}
      >
        {selectedLesson && selectedModule && (
          <LessonScreen
            lesson={selectedLesson}
            module={selectedModule}
            skillId={selectedLesson.skill_id}
            lessonCount={11}
            onBack={() => setSelectedLesson(null)}
            onSaveForLater={(lessonId) => {
              setStartedLessons((prev) => new Set([...prev, lessonId]));
            }}
            onComplete={() => {
              setCompletedLessons(
                (prev) => new Set([...prev, selectedLesson.id]),
              );
              setStartedLessons((prev) => {
                const next = new Set(prev);
                next.delete(selectedLesson.id);
                return next;
              });
              setSelectedLesson(null);
            }}
          />
        )}
      </Modal>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Learn</Text>
          <Text style={styles.headerSub}>Your DBT skill journey</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Active module — Mindfulness */}
          <View style={[styles.activeModule, { backgroundColor: colours.white }]}>
            <View style={styles.moduleHeader}>
              <View
                style={[
                  styles.moduleIcon,
                  { backgroundColor: colours.mindfulness },
                ]}
              >
                <Ionicons name="leaf-outline" size={18} color={colours.white} />
              </View>
              <View>
                <Text style={[styles.moduleTitle, { color: colours.textDark }]}>
                  Mindfulness
                </Text>
                <Text style={styles.moduleSub}>Module 1 of 4 · Active now</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressRow}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(completedLessons.size / 11) * 100}%`,
                      backgroundColor: colours.mindfulness,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.progressLabel, { color: colours.mindfulness }]}
              >
                {completedLessons.size} of 11
              </Text>
            </View>

            {/* Lesson list */}
            <View style={styles.lessonList}>
              {/* Lesson 1 */}
              <TouchableOpacity
                style={[
                  styles.lessonItem,
                  completedLessons.has("lesson-1")
                    ? styles.lessonCompleted
                    : startedLessons.has("lesson-1")
                      ? styles.lessonStarted
                      : styles.lessonActive,
                ]}
                onPress={() =>
                  openLesson(
                    "lesson-1",
                    "Wise Mind",
                    "Wise Mind is the balance between Emotion Mind and Reasonable Mind. Emotion Mind is driven by feelings — intense, urgent, overwhelming. Reasonable Mind is logical and rational, but can miss what matters emotionally. Wise Mind is the integration of both — your inner wisdom that knows what is true and what is right for you.",
                    "Think of a recent decision you made. Which mind state were you in — Emotion Mind, Reasonable Mind, or Wise Mind? What would Wise Mind have said?",
                    10,
                    1,
                    "578ae786-a1c6-4f01-821b-115b70560ff2",
                  )
                }
              >
                <View
                  style={[
                    styles.lessonNum,
                    { backgroundColor: colours.mindfulness },
                  ]}
                >
                  {completedLessons.has("lesson-1") ? (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={colours.white}
                    />
                  ) : (
                    <Text style={styles.lessonNumText}>1</Text>
                  )}
                </View>
                <View style={styles.lessonBody}>
                  <Text style={styles.lessonName}>Wise Mind</Text>
                  <Text style={styles.lessonMeta}>10 min</Text>
                </View>
                {getLessonTrailingIcon(
                  "lesson-1",
                  "chevron-forward",
                  colours.teal,
                )}
              </TouchableOpacity>

              {/* Lesson 2 */}
              <TouchableOpacity
                style={[
                  styles.lessonItem,
                  completedLessons.has("lesson-2")
                    ? styles.lessonCompleted
                    : startedLessons.has("lesson-2")
                      ? styles.lessonStarted
                      : styles.lessonActive,
                ]}
                onPress={() =>
                  openLesson(
                    "lesson-2",
                    "Balancing Doing Mind and Being Mind",
                    "Doing Mind is goal-oriented...",
                    "When do you find yourself...",
                    10,
                    2,
                    undefined, // no matching skill yet
                  )
                }
              >
                <View
                  style={[
                    styles.lessonNum,
                    { backgroundColor: colours.mindfulness },
                  ]}
                >
                  {completedLessons.has("lesson-2") ? (
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={colours.white}
                    />
                  ) : (
                    <Text style={styles.lessonNumText}>2</Text>
                  )}
                </View>
                <View style={styles.lessonBody}>
                  <Text style={styles.lessonName}>
                    Balancing Doing Mind and Being Mind
                  </Text>
                  <Text style={styles.lessonMeta}>10 min</Text>
                </View>
                {getLessonTrailingIcon(
                  "lesson-2",
                  "chevron-forward",
                  colours.teal,
                )}
              </TouchableOpacity>

              {/* Lessons 3-11 locked */}
              {[
                {
                  num: 3,
                  name: "What Skills: Observe, Describe, Participate",
                  duration: 10,
                },
                {
                  num: 4,
                  name: "How Skills: Non-judgementally, One-mindfully, Effectively",
                  duration: 10,
                },
                { num: 5, name: "Walking the Middle Path", duration: 10 },
                { num: 6, name: "Breathing Exercises", duration: 5 },
                { num: 7, name: "Awareness Exercises", duration: 5 },
                { num: 8, name: "Mindfulness Exercises", duration: 10 },
                { num: 9, name: "A Day of Mindfulness", duration: 15 },
                { num: 10, name: "Loving Kindness", duration: 10 },
                { num: 11, name: "Spirituality", duration: 10 },
              ].map((lesson) => (
                <View
                  key={lesson.num}
                  style={[styles.lessonItem, styles.lessonLocked]}
                >
                  <View
                    style={[
                      styles.lessonNum,
                      { backgroundColor: colours.borderLight },
                    ]}
                  >
                    <Text
                      style={[styles.lessonNumText, { color: colours.textMid }]}
                    >
                      {lesson.num}
                    </Text>
                  </View>
                  <View style={styles.lessonBody}>
                    <Text
                      style={[styles.lessonName, { color: colours.textMid }]}
                    >
                      {lesson.name}
                    </Text>
                    <Text style={styles.lessonMeta}>
                      {"Locked · " + lesson.duration + " min"}{" "}
                    </Text>
                  </View>
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color={colours.lightGrey}
                  />
                </View>
              ))}
            </View>

            {/* Continue button */}
            <TouchableOpacity style={styles.continueBtn}>
              <Ionicons name="play" size={14} color={colours.white} />
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>

          {/* Locked modules */}
          {[
            {
              name: "Distress Tolerance",
              sub: "Unlocks after Mindfulness",
              colour: colours.distressTolerance,
              icon: "shield-outline",
            },
            {
              name: "Emotion Regulation",
              sub: "Unlocks after Distress Tolerance",
              colour: colours.emotionRegulation,
              icon: "heart-outline",
            },
            {
              name: "Interpersonal Effectiveness",
              sub: "Unlocks after Emotion Regulation",
              colour: colours.interpersonal,
              icon: "people-outline",
            },
          ].map((mod) => (
            <View key={mod.name} style={styles.lockedModule}>
              <View
                style={[styles.lockedIcon, { backgroundColor: mod.colour }]}
              >
                <Ionicons
                  name={mod.icon as any}
                  size={18}
                  color={colours.white}
                />
              </View>
              <View style={styles.lockedBody}>
                <Text style={styles.lockedName}>{mod.name}</Text>
                <Text style={styles.lockedSub}>{mod.sub}</Text>
              </View>
              <View style={styles.lockedBadge}>
                <Ionicons
                  name="lock-closed-outline"
                  size={11}
                  color={colours.lightGrey}
                />
                <Text style={styles.lockedBadgeText}>Locked</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  header: {
    backgroundColor: colours.background,
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.headingBold,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    fontWeight: "700",
  },
  headerSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 32,
  },
  activeModule: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colours.borderCard,
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  moduleIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    fontWeight: "700",
  },
  moduleSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  progressBg: {
    flex: 1,
    height: 6,
    backgroundColor: colours.borderLight,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
  lessonList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  lessonItem: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: minTouchTarget,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  lessonCompleted: {
    backgroundColor: colours.softMint,
    borderColor: colours.mindfulness,
  },
  lessonActive: {
    borderColor: colours.mindfulness,
    borderWidth: 1.5,
  },
  lessonStarted: {
    borderColor: colours.warning,
    borderWidth: 1.5,
  },
  lessonLocked: {
    opacity: 0.6,
  },
  lessonNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lessonNumText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.white,
    fontWeight: "700",
  },
  lessonBody: {
    flex: 1,
  },
  lessonName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  lessonMeta: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  startedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colours.warning,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtn: {
    backgroundColor: colours.teal,
    borderRadius: radius.sm,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: minTouchTarget,
  },
  continueBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.white,
    fontWeight: "700",
  },
  lockedModule: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    opacity: 0.6,
    minHeight: 64,
  },
  lockedIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lockedBody: {
    flex: 1,
  },
  lockedName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  lockedSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colours.background,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  lockedBadgeText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.lightGrey,
    fontWeight: "700",
  },
});
