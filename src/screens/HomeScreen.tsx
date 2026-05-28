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

import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

// Services
import { logMood } from "../services/mood";
import { startModule } from "../services/progress";

export default function HomeScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const navigation = useNavigation();

  async function handleMoodTap(mood: string) {
    setSelectedMood(mood);
    const userId = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";
    const saved = await logMood(mood as any, userId);
    if (saved) {
      setMoodSaved(true);
      setTimeout(() => setMoodSaved(false), 2000);
    }
  }

  async function handleBegin() {
    const userId = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";
    const moduleId = "c6eabef4-d24e-4fee-a2fa-812b6dc53add";
    const result = await startModule(userId, moduleId);
    console.log("handleBegin result:", result);
    console.log("Attempting navigation to Learn");
    navigation.navigate("Learn" as never);
    if (result) {
      console.log("Module started!");
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <View>
            <Text style={styles.greetingSub}>Good morning,</Text>
            <Text style={styles.greetingName}>Hannah</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="rgba(255,255,255,0.9)"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons
              name="settings-outline"
              size={22}
              color="rgba(255,255,255,0.9)"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Learning path card */}
        <View style={[styles.card, { backgroundColor: colours.cardLearning }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="map-outline" size={14} color="#3d2d4a" />
            <Text style={[styles.cardTitle, { color: "#3d2d4a" }]}>
              Your learning path
            </Text>
          </View>
          <View style={styles.lpItem}>
            <View
              style={[styles.lpIcon, { backgroundColor: colours.mindfulness }]}
            >
              <Ionicons name="leaf-outline" size={14} color={colours.white} />
            </View>
            <View style={styles.lpBody}>
              <Text style={styles.lpName}>Mindfulness</Text>
              <Text style={styles.lpSub}>Module 1 — everyone starts here</Text>
              <View style={styles.lpBarBg}>
                <View
                  style={[
                    styles.lpBar,
                    { width: "1%", backgroundColor: colours.mindfulness },
                  ]}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.lpBadge} onPress={handleBegin}>
              <Text
                style={[styles.lpBadgeText, { color: colours.mindfulness }]}
              >
                Begin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Favourite skills card */}
        <View style={[styles.card, { backgroundColor: colours.cardSkills }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="star-outline" size={14} color="#2d5a52" />
            <Text style={[styles.cardTitle, { color: "#2d5a52" }]}>
              Favourite skills
            </Text>
          </View>
          <View style={styles.welcomeBanner}>
            <View style={styles.welcomeBannerTitleRow}>
              <Ionicons name="bulb-outline" size={13} color={colours.teal} />
              <Text style={styles.welcomeBannerTitle}>
                We've started you off
              </Text>
            </View>
            <Text style={styles.welcomeBannerText}>
              STOP and TIPP are two of the most useful DBT skills to have right
              away. Swap them out anytime.
            </Text>
          </View>
          <View style={styles.favGrid}>
            <TouchableOpacity style={styles.favChip}>
              <Ionicons
                name="hand-left-outline"
                size={16}
                color={colours.teal}
              />
              <Text style={styles.favChipName}>STOP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.favChip}>
              <Ionicons name="snow-outline" size={16} color={colours.teal} />
              <Text style={styles.favChipName}>TIPP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favChip, styles.favChipEmpty]}>
              <Ionicons
                name="add-outline"
                size={16}
                color={colours.textPlaceholder}
              />
              <Text
                style={[styles.favChipName, { color: colours.textPlaceholder }]}
              >
                Add skill
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favChip, styles.favChipEmpty]}>
              <Ionicons
                name="add-outline"
                size={16}
                color={colours.textPlaceholder}
              />
              <Text
                style={[styles.favChipName, { color: colours.textPlaceholder }]}
              >
                Add skill
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood card */}
        <View style={[styles.card, { backgroundColor: colours.cardMood }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons
              name="happy-outline"
              size={14}
              color={colours.peachText}
            />
            <Text style={[styles.cardTitle, { color: colours.peachText }]}>
              How are you feeling today?
            </Text>
          </View>
          <View style={styles.moodRow}>
            {[
              { emoji: "😔", label: "Low", value: "low" },
              { emoji: "😐", label: "Okay", value: "okay" },
              { emoji: "🙂", label: "Good", value: "good" },
              { emoji: "😊", label: "Great", value: "great" },
            ].map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodBtn,
                  selectedMood === mood.value && styles.moodBtnSelected,
                ]}
                onPress={() => handleMoodTap(mood.value)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {moodSaved && <Text style={styles.moodSavedText}>Mood logged ✓</Text>}
          <View style={styles.divider} />
          <TouchableOpacity style={styles.journalRow}>
            <Text style={styles.journalPrompt}>Get it off your chest...</Text>
            <View style={styles.journalLinkRow}>
              <Ionicons name="journal-outline" size={14} color={colours.teal} />
              <Text style={styles.journalLink}>Journal</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Distract Me card */}
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colours.skyLight }]}
          onPress={() => navigation.navigate("Toolkit" as never)}
        >
          <View style={styles.cardTitleRow}>
            <Ionicons
              name="game-controller-outline"
              size={14}
              color={colours.skyText}
            />
            <Text style={[styles.cardTitle, { color: colours.skyText }]}>
              Distract Me
            </Text>{" "}
          </View>
          <Text style={styles.distractDesc}>
            Feeling overwhelmed? Pick something you love and we'll talk about
            it.
          </Text>
          <View style={styles.distractBtnRow}>
            <Text style={styles.distractBtnText}>Let's go</Text>
            <Ionicons
              name="arrow-forward-outline"
              size={14}
              color={colours.skyText}
            />
          </View>
        </TouchableOpacity>

        {/* Community card */}
        <View style={[styles.card, { backgroundColor: colours.cardCommunity }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="people-outline" size={14} color="#6b3518" />
            <Text style={[styles.cardTitle, { color: "#6b3518" }]}>
              Community
            </Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Community posts will appear here as people share their
              experiences.
            </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colours.peach,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.teal,
    fontWeight: "700",
  },
  greetingSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.8)",
  },
  greetingName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  headerIcon: {
    minHeight: minTouchTarget,
    minWidth: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: 32,
    flexGrow: 1,
  },
  card: {
    borderRadius: radius.md,
    padding: spacing.xl,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    fontWeight: "700",
  },
  lpItem: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  lpIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  lpBody: {
    flex: 1,
  },
  lpName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  lpSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  lpBarBg: {
    height: 4,
    backgroundColor: colours.borderLight,
    borderRadius: 2,
    marginTop: 5,
  },
  lpBar: {
    height: 4,
    borderRadius: 2,
  },
  lpBadge: {
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: colours.mindfulness,
    backgroundColor: colours.white,
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  lpBadgeText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
  welcomeBanner: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderLeftWidth: 2.5,
    borderLeftColor: colours.teal,
    marginBottom: spacing.sm,
  },
  welcomeBannerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 2,
  },
  welcomeBannerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.teal,
    fontWeight: "700",
  },
  welcomeBannerText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.tealDark,
    lineHeight: 18,
  },
  favGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  favChip: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    width: "47%",
    minHeight: minTouchTarget,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  favChipEmpty: {
    opacity: 0.4,
    borderStyle: "dashed",
  },
  favChipName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.textDark,
    fontWeight: "700",
  },
  moodRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  moodBtn: {
    flex: 1,
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.sm,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
    gap: 2,
  },
  moodEmoji: {
    fontSize: 20,
  },
  moodLabel: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.peachText,
  },
  divider: {
    height: 0.5,
    backgroundColor: "rgba(107,66,0,0.15)",
    marginVertical: spacing.sm,
  },
  journalRow: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: minTouchTarget,
  },
  journalPrompt: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.peachText,
    fontStyle: "italic",
  },
  journalLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  journalLink: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.teal,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    padding: spacing.md,
    alignItems: "center",
  },
  emptyStateText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    textAlign: "left",
    lineHeight: 18,
  },
  moodBtnSelected: {
    borderWidth: 1.5,
    borderColor: colours.teal,
    backgroundColor: colours.tealLight,
  },
  moodSavedText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.teal,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  distractDesc: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.skyText,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  distractBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.skyText,
    fontWeight: "700",
  },
  distractBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
