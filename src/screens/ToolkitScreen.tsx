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

export default function ToolkitScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toolkit</Text>
        <TouchableOpacity style={styles.sosBtn}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={colours.white}
          />
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Favourite skills */}
        <View style={[styles.section, { backgroundColor: colours.cardSkills }]}>
          <Text style={[styles.sectionTitle, { color: "#2d5a52" }]}>
            <Ionicons name="star-outline" size={13} color="#2d5a52" /> Favourite
            skills
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.skillsScroll}
          >
            {[
              {
                icon: "hand-left-outline",
                name: "STOP",
                module: "Distress tol.",
              },
              { icon: "snow-outline", name: "TIPP", module: "Distress tol." },
              {
                icon: "wind-outline",
                name: "Box breathing",
                module: "Mindfulness",
              },
              { icon: "eye-outline", name: "5-4-3-2-1", module: "Mindfulness" },
            ].map((skill) => (
              <TouchableOpacity key={skill.name} style={styles.skillChip}>
                <Ionicons
                  name={skill.icon as any}
                  size={20}
                  color={colours.teal}
                />
                <Text style={styles.skillChipName}>{skill.name}</Text>
                <Text style={styles.skillChipModule}>{skill.module}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.skillChip, styles.skillChipEmpty]}>
              <Ionicons
                name="add-outline"
                size={20}
                color={colours.lightGrey}
              />
              <Text
                style={[
                  styles.skillChipName,
                  { color: colours.lightGrey, fontWeight: "400" },
                ]}
              >
                Add skill
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Get out of that mood */}
        <View style={[styles.section, { backgroundColor: colours.cardMood }]}>
          <Text style={[styles.sectionTitle, { color: colours.peachText }]}>
            <Ionicons
              name="happy-outline"
              size={13}
              color={colours.peachText}
            />{" "}
            Get out of that mood
          </Text>
          <View style={styles.moodGrid}>
            {[
              {
                icon: "musical-notes-outline",
                name: "My songs",
                sub: "Saved playlist",
                colour: colours.distressTolerance,
              },
              {
                icon: "book-outline",
                name: "My books",
                sub: "Saved reads",
                colour: colours.mindfulness,
              },
              {
                icon: "heart-outline",
                name: "Self-soothe",
                sub: "Comfort list",
                colour: colours.emotionRegulation,
              },
              {
                icon: "sparkles-outline",
                name: "Distract me",
                sub: "AI powered",
                colour: colours.interpersonal,
              },
            ].map((item) => (
              <TouchableOpacity key={item.name} style={styles.moodItem}>
                <View
                  style={[
                    styles.moodItemIcon,
                    { backgroundColor: item.colour },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={colours.white}
                  />
                </View>
                <View>
                  <Text style={styles.moodItemName}>{item.name}</Text>
                  <Text style={styles.moodItemSub}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* DBT Skills library */}
        <View
          style={[styles.section, { backgroundColor: colours.cardLearning }]}
        >
          <Text style={[styles.sectionTitle, { color: "#3d2d4a" }]}>
            <Ionicons name="library-outline" size={13} color="#3d2d4a" /> DBT
            skills library
          </Text>

          {/* Module filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {[
              "All",
              "Mindfulness",
              "Distress tol.",
              "Emotion reg.",
              "Interpersonal",
            ].map((tab, i) => (
              <TouchableOpacity
                key={tab}
                style={[styles.moduleTab, i === 0 && styles.moduleTabActive]}
              >
                <Text
                  style={[
                    styles.moduleTabText,
                    i === 0 && styles.moduleTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Skills list */}
          <View style={styles.skillsList}>
            {[
              {
                icon: "hand-left-outline",
                name: "STOP",
                desc: "Pause before you react",
                colour: colours.distressTolerance,
                saved: true,
                locked: false,
              },
              {
                icon: "leaf-outline",
                name: "Wise Mind",
                desc: "Finding your balanced perspective",
                colour: colours.mindfulness,
                saved: false,
                locked: false,
              },
              {
                icon: "sync-outline",
                name: "Opposite Action",
                desc: "Unlocks in Emotion Regulation",
                colour: colours.lightGrey,
                saved: false,
                locked: true,
              },
            ].map((skill) => (
              <View
                key={skill.name}
                style={[
                  styles.skillItem,
                  skill.locked && styles.skillItemLocked,
                ]}
              >
                <View
                  style={[
                    styles.skillItemIcon,
                    { backgroundColor: skill.colour },
                  ]}
                >
                  <Ionicons
                    name={skill.icon as any}
                    size={14}
                    color={colours.white}
                  />
                </View>
                <View style={styles.skillItemBody}>
                  <Text style={styles.skillItemName}>{skill.name}</Text>
                  <Text style={styles.skillItemDesc}>{skill.desc}</Text>
                </View>
                {skill.locked ? (
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color={colours.lightGrey}
                  />
                ) : (
                  <Ionicons
                    name={skill.saved ? "star" : "star-outline"}
                    size={18}
                    color={skill.saved ? colours.teal : colours.lightGrey}
                  />
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See all skills →</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.white,
    fontWeight: "700",
  },
  sosBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    minHeight: minTouchTarget,
  },
  sosBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.white,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: 32,
  },
  section: {
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  skillsScroll: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  skillChip: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
    width: 90,
    minHeight: 72,
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  skillChipEmpty: {
    opacity: 0.4,
    borderStyle: "dashed",
  },
  skillChipName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.textDark,
    fontWeight: "700",
    textAlign: "center",
  },
  skillChipModule: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colours.textMid,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  moodItem: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    width: "47%",
    minHeight: minTouchTarget,
    borderWidth: 0.5,
    borderColor: colours.peachBorder,
  },
  moodItemIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  moodItemName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.textDark,
    fontWeight: "700",
  },
  moodItemSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  tabsScroll: {
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingRight: spacing.md,
  },
  moduleTab: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 28,
    justifyContent: "center",
  },
  moduleTabActive: {
    backgroundColor: colours.white,
  },
  moduleTabText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: "#3d2d4a",
    fontWeight: "700",
  },
  moduleTabTextActive: {
    color: "#3d2d4a",
  },
  skillsList: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  skillItem: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    minHeight: minTouchTarget,
  },
  skillItemLocked: {
    opacity: 0.5,
  },
  skillItemIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  skillItemBody: {
    flex: 1,
  },
  skillItemName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  skillItemDesc: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  seeAllBtn: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  seeAllText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: "#3d2d4a",
    fontWeight: "700",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
});
