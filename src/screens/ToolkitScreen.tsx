import {
  View,
  Text,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
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
  getFavouriteSkills,
  addFavouriteSkill,
  removeFavouriteSkill,
  getAllSkills,
} from "../services/favourites";

const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";
const MAX_FAVOURITES = 5;

export default function ToolkitScreen() {
  const [skills, setSkills] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [feedback, setFeedback] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [skillsData, favsData] = await Promise.all([
      getAllSkills(),
      getFavouriteSkills(DEV_USER_ID),
    ]);
    setSkills(skillsData);
    setFavourites(favsData);
  }

  function isFavourited(skillId: string) {
    return favourites.some((f) => f.skill_id === skillId);
  }

  async function handleToggleFavourite(skillId: string) {
    if (isFavourited(skillId)) {
      await removeFavouriteSkill(DEV_USER_ID, skillId);
      await loadData();
      showFeedback("Removed from favourites");
    } else {
      const result = await addFavouriteSkill(DEV_USER_ID, skillId);
      if (result.reason === "max_reached") {
        showFeedback("You can only have 5 favourite skills — remove one first");
      } else if (result.reason === "already_added") {
        showFeedback("Already in your favourites");
      } else {
        await loadData();
        showFeedback("Added to favourites");
      }
    }
  }

  function showFeedback(message: string) {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2500);
  }

  const tabs = [
    "All",
    "Mindfulness",
    "Distress tol.",
    "Emotion reg.",
    "Interpersonal",
  ];

  const moduleNameToTab: Record<string, string> = {
    Mindfulness: "Mindfulness",
    "Distress Tolerance": "Distress tol.",
    "Emotion Regulation": "Emotion reg.",
    "Interpersonal Effectiveness": "Interpersonal",
  };

  const filteredSkills =
    activeTab === "All"
      ? skills
      : skills.filter((s) => moduleNameToTab[s.modules?.name] === activeTab);

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

      {/* Feedback banner */}
      {feedback && (
        <View style={styles.feedbackBanner}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Favourite skills */}
        <View style={[styles.section, { backgroundColor: colours.cardSkills }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="star-outline" size={13} color="#2d5a52" />
            <Text style={[styles.sectionTitle, { color: "#2d5a52" }]}>
              Favourite skills
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.skillsScroll}
          >
            {favourites.length === 0 ? (
              <View style={styles.favEmpty}>
                <Text style={styles.favEmptyText}>
                  Complete lessons to add skills to your favourites
                </Text>
              </View>
            ) : (
              favourites.map((fav) => (
                <TouchableOpacity key={fav.id} style={styles.skillChip}>
                  <Ionicons
                    name={(fav.skills?.icon || "star-outline") as any}
                    size={20}
                    color={colours.teal}
                  />
                  <Text style={styles.skillChipName}>{fav.skills?.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
        {/* Get out of that mood */}
        <View style={[styles.section, { backgroundColor: colours.cardMood }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="happy-outline"
              size={13}
              color={colours.peachText}
            />
            <Text style={[styles.sectionTitle, { color: colours.peachText }]}>
              Get out of that mood
            </Text>
          </View>
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
          <View style={styles.sectionTitleRow}>
            <Ionicons name="library-outline" size={13} color="#3d2d4a" />
            <Text style={[styles.sectionTitle, { color: "#3d2d4a" }]}>
              DBT skills library
            </Text>
          </View>

          {/* Module filter tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.moduleTab,
                  activeTab === tab && styles.moduleTabActive,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.moduleTabText,
                    activeTab === tab && styles.moduleTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Skills list */}
          <View style={styles.skillsList}>
            {filteredSkills.length === 0 ? (
              <View style={styles.emptySkills}>
                <Text style={styles.emptySkillsText}>No skills yet</Text>
              </View>
            ) : (
              filteredSkills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <View
                    style={[
                      styles.skillItemIcon,
                      {
                        backgroundColor: skill.modules?.colour || colours.teal,
                      },
                    ]}
                  >
                    <Ionicons
                      name={(skill.icon || "star-outline") as any}
                      size={14}
                      color={colours.white}
                    />
                  </View>
                  <View style={styles.skillItemBody}>
                    <Text style={styles.skillItemName}>{skill.name}</Text>
                    <Text style={styles.skillItemDesc}>
                      {skill.description}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
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
  feedbackBanner: {
    backgroundColor: colours.tealLight,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colours.borderLight,
  },
  feedbackText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.tealDark,
    textAlign: "center",
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
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    fontWeight: "700",
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
  favEmpty: {
    padding: spacing.md,
    justifyContent: "center",
  },
  favEmptyText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.tealDark,
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
  favBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySkills: {
    padding: spacing.md,
    alignItems: "center",
  },
  emptySkillsText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textMid,
  },
});
