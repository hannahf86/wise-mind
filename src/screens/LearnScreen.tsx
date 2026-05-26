import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colours,
  fonts,
  fontSizes,
  spacing,
  radius,
  minTouchTarget,
  modules,
} from "../theme/theme";

export default function LearnScreen() {
  return (
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
        <View style={[styles.activeModule, { backgroundColor: "#d6e8f5" }]}>
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
              <Text style={[styles.moduleTitle, { color: "#222" }]}>
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
                  { width: "25%", backgroundColor: colours.mindfulness },
                ]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: "#4a7a94" }]}>
              2 of 8
            </Text>
          </View>

          {/* Lesson list */}
          <View style={styles.lessonList}>
            {/* Completed lesson */}
            <TouchableOpacity
              style={[styles.lessonItem, styles.lessonCompleted]}
            >
              <View
                style={[
                  styles.lessonNum,
                  { backgroundColor: colours.mindfulness },
                ]}
              >
                <Ionicons name="checkmark" size={12} color={colours.white} />
              </View>
              <View style={styles.lessonBody}>
                <Text style={styles.lessonName}>What is Wise Mind?</Text>
                <Text style={styles.lessonMeta}>Completed · 3 min</Text>
              </View>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colours.teal}
              />
            </TouchableOpacity>

            {/* Active lesson */}
            <TouchableOpacity style={[styles.lessonItem, styles.lessonActive]}>
              <View
                style={[
                  styles.lessonNum,
                  { backgroundColor: colours.mindfulness },
                ]}
              >
                <Text style={styles.lessonNumText}>2</Text>
              </View>
              <View style={styles.lessonBody}>
                <Text style={styles.lessonName}>
                  Observing without judgement
                </Text>
                <Text style={styles.lessonMeta}>Up next · 4 min</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colours.teal} />
            </TouchableOpacity>

            {/* Locked lessons */}
            {[
              { num: 3, name: "One-mindfully", duration: "3 min" },
              { num: 4, name: "Non-judgementally", duration: "4 min" },
              { num: 5, name: "Effectively", duration: "3 min" },
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
                  <Text style={[styles.lessonName, { color: colours.textMid }]}>
                    {lesson.name}
                  </Text>
                  <Text style={styles.lessonMeta}>
                    Locked · {lesson.duration}
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
            <Text style={styles.continueBtnText}>Continue — Lesson 2</Text>
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
            <View style={[styles.lockedIcon, { backgroundColor: mod.colour }]}>
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
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.white,
    fontWeight: "700",
  },
  headerSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.8)",
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
    borderRadius: radius.md,
    padding: spacing.lg,
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
    backgroundColor: "rgba(255,255,255,0.5)",
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
    backgroundColor: "#eef6fb",
    borderColor: colours.mindfulness,
  },
  lessonActive: {
    borderColor: colours.mindfulness,
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
