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
} from "../theme/theme";

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Journal</Text>
          <TouchableOpacity style={styles.newEntryBtn}>
            <Ionicons name="pencil-outline" size={14} color={colours.white} />
            <Text style={styles.newEntryText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly tracker */}
        <View style={styles.weeklyTracker}>
          <Text style={styles.weeklyTrackerLabel}>This week</Text>
          <View style={styles.trackerDays}>
            {[
              { day: "M", filled: true },
              { day: "T", filled: true },
              { day: "W", filled: false },
              { day: "T", filled: true },
              { day: "F", filled: true },
              { day: "S", filled: true, today: true },
              { day: "S", filled: false },
            ].map((d, i) => (
              <View key={i} style={styles.trackerDay}>
                <View
                  style={[
                    styles.trackerBar,
                    d.filled && styles.trackerBarFilled,
                    d.today && styles.trackerBarToday,
                  ]}
                />
                <Text style={styles.trackerDayLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.trackerBottom}>
            <Text style={styles.trackerCount}>5 of 7 this week</Text>
            <Text style={styles.trackerMessage}>Excellent week 🌿</Text>
          </View>
        </View>

        {/* List / Calendar toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity style={[styles.toggleBtn, styles.toggleBtnActive]}>
            <Text style={[styles.toggleBtnText, styles.toggleBtnTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleBtn}>
            <Text style={styles.toggleBtnText}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {["All", "Reflections", "Free write", "Mood", "Diary card"].map(
            (f, i) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, i === 0 && styles.filterPillActive]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    i === 0 && styles.filterPillTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>

        {/* Today */}
        <Text style={styles.groupLabel}>Today</Text>

        {/* Lesson reflection entry */}
        <TouchableOpacity style={styles.entryCard}>
          <View style={styles.entryTop}>
            <View
              style={[
                styles.entryIcon,
                { backgroundColor: colours.mindfulness },
              ]}
            >
              <Ionicons name="book-outline" size={14} color={colours.white} />
            </View>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>Observing without judgement</Text>
              <View style={styles.entryMeta}>
                <Text style={styles.entryMetaText}>Lesson reflection</Text>
                <View style={styles.entryMetaDot} />
                <Text style={styles.entryTime}>9:52 am</Text>
              </View>
            </View>
          </View>
          <Text style={styles.entryPreview} numberOfLines={2}>
            I noticed I was anxious before my meeting but tried to just sit with
            it rather than spiral...
          </Text>
          <View style={styles.entryTags}>
            <View style={[styles.entryTag, { backgroundColor: "#e8f3f7" }]}>
              <Text style={[styles.entryTagText, { color: "#4a7a94" }]}>
                Mindfulness
              </Text>
            </View>
            <View style={styles.sharedBadge}>
              <Ionicons name="medical-outline" size={10} color={colours.teal} />
              <Text style={styles.sharedBadgeText}>Therapist</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Diary card entry */}
        <TouchableOpacity style={styles.entryCard}>
          <View style={styles.entryTop}>
            <View
              style={[
                styles.entryIcon,
                { backgroundColor: colours.cardLearning },
              ]}
            >
              <Ionicons
                name="clipboard-outline"
                size={14}
                color={colours.white}
              />
            </View>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>Daily diary card</Text>
              <View style={styles.entryMeta}>
                <Text style={styles.entryMetaText}>Skills used today</Text>
                <View style={styles.entryMetaDot} />
                <Text style={styles.entryTime}>8:30 am</Text>
              </View>
            </View>
          </View>
          <View style={styles.diarySkills}>
            <View style={styles.diarySkill}>
              <Ionicons name="checkmark" size={12} color={colours.teal} />
              <Text style={styles.diarySkillText}>
                STOP — before a difficult email
              </Text>
            </View>
            <View style={styles.diarySkill}>
              <Ionicons name="checkmark" size={12} color={colours.teal} />
              <Text style={styles.diarySkillText}>
                Box breathing — on the bus
              </Text>
            </View>
          </View>
          <View style={styles.entryTags}>
            <View style={styles.sharedBadge}>
              <Ionicons name="medical-outline" size={10} color={colours.teal} />
              <Text style={styles.sharedBadgeText}>Therapist</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Mood entry */}
        <TouchableOpacity style={styles.entryCard}>
          <View style={styles.entryTop}>
            <View
              style={[styles.entryIcon, { backgroundColor: colours.cardMood }]}
            >
              <Ionicons
                name="happy-outline"
                size={14}
                color={colours.peachText}
              />
            </View>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>Mood check-in</Text>
              <View style={styles.entryMeta}>
                <Text style={styles.entryTime}>8:14 am</Text>
              </View>
            </View>
          </View>
          <View style={styles.moodEntry}>
            <Text style={styles.moodEntryEmoji}>🙂</Text>
            <Text style={styles.moodEntryText}>Good</Text>
            <Text style={styles.moodEntryTime}>8:14 am</Text>
          </View>
          <View style={styles.entryTags}>
            <View style={styles.privateBadge}>
              <Ionicons
                name="lock-closed-outline"
                size={10}
                color={colours.lightGrey}
              />
              <Text style={styles.privateBadgeText}>Private</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Yesterday */}
        <Text style={styles.groupLabel}>Yesterday</Text>

        {/* Free write entry */}
        <TouchableOpacity style={styles.entryCard}>
          <View style={styles.entryTop}>
            <View
              style={[
                styles.entryIcon,
                { backgroundColor: colours.cardCommunity },
              ]}
            >
              <Ionicons name="create-outline" size={14} color="#6b3518" />
            </View>
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>Hard day at work</Text>
              <View style={styles.entryMeta}>
                <Text style={styles.entryMetaText}>Free write</Text>
                <View style={styles.entryMetaDot} />
                <Text style={styles.entryTime}>8:41 pm</Text>
              </View>
            </View>
          </View>
          <Text style={styles.entryPreview} numberOfLines={2}>
            Today was genuinely tough. I kept catching myself catastrophising...
          </Text>
          <View style={styles.entryTags}>
            <View style={styles.privateBadge}>
              <Ionicons
                name="lock-closed-outline"
                size={10}
                color={colours.lightGrey}
              />
              <Text style={styles.privateBadgeText}>Private</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Write button */}
        <TouchableOpacity style={styles.writeBtn}>
          <Ionicons name="pencil-outline" size={16} color={colours.white} />
          <Text style={styles.writeBtnText}>Write a new entry</Text>
        </TouchableOpacity>
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
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.white,
    fontWeight: "700",
  },
  newEntryBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: minTouchTarget,
  },
  newEntryText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.white,
    fontWeight: "500",
  },
  weeklyTracker: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  weeklyTrackerLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacing.sm,
  },
  trackerDays: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  trackerDay: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  trackerBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  trackerBarFilled: {
    backgroundColor: colours.white,
  },
  trackerBarToday: {
    backgroundColor: colours.peachLight,
  },
  trackerDayLabel: {
    fontFamily: fonts.body,
    fontSize: 8,
    color: "rgba(255,255,255,0.6)",
  },
  trackerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackerCount: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.white,
    fontWeight: "700",
  },
  trackerMessage: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: "rgba(255,255,255,0.9)",
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.sm,
    padding: 3,
    gap: 3,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: radius.sm,
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  toggleBtnActive: {
    backgroundColor: colours.white,
  },
  toggleBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
  },
  toggleBtnTextActive: {
    color: colours.teal,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 32,
  },
  filterRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  filterPill: {
    backgroundColor: colours.white,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colours.borderLight,
    minHeight: 32,
    justifyContent: "center",
  },
  filterPillActive: {
    backgroundColor: colours.teal,
    borderColor: colours.teal,
  },
  filterPillText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    fontWeight: "700",
  },
  filterPillTextActive: {
    color: colours.white,
  },
  groupLabel: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  entryCard: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  entryTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  entryIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  entryHeader: {
    flex: 1,
  },
  entryTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  entryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 2,
  },
  entryMetaText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
  },
  entryMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colours.lightGrey,
  },
  entryTime: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textLight,
    fontWeight: "500",
  },
  entryPreview: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textMid,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  entryTags: {
    flexDirection: "row",
    gap: spacing.xs,
    flexWrap: "wrap",
    alignItems: "center",
  },
  entryTag: {
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  entryTagText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
  sharedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colours.tealLight,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  sharedBadgeText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.teal,
    fontWeight: "700",
  },
  privateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colours.background,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  privateBadgeText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.lightGrey,
    fontWeight: "700",
  },
  diarySkills: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  diarySkill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  diarySkillText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textDark,
  },
  moodEntry: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  moodEntryEmoji: {
    fontSize: 16,
  },
  moodEntryText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textDark,
    fontWeight: "500",
    flex: 1,
  },
  moodEntryTime: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textLight,
    fontWeight: "500",
  },
  writeBtn: {
    backgroundColor: colours.teal,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: minTouchTarget,
  },
  writeBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
});
