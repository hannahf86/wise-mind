import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  colours,
  fonts,
  fontSizes,
  spacing,
  radius,
  minTouchTarget,
} from "../theme/theme";
import { getJournalEntries } from "../services/journal";
import NewEntryScreen from "./NewEntryScreen";

export default function JournalScreen() {
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  async function loadEntries() {
    const data = await getJournalEntries(
      "99b6fc7e-93c5-4dfa-9192-25067d68fdff",
    );
    setEntries(data);
    setLoadingEntries(false);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  function entryColour(type: string) {
    switch (type) {
      case "reflection":
        return colours.mindfulness;
      case "gratitude":
        return colours.distressTolerance;
      case "diary_card":
        return colours.emotionRegulation;
      case "sos_log":
        return colours.interpersonal;
      default:
        return colours.teal;
    }
  }

  function entryIcon(type: string): keyof typeof Ionicons.glyphMap {
    switch (type) {
      case "reflection":
        return "book-outline";
      case "gratitude":
        return "heart-outline";
      case "diary_card":
        return "clipboard-outline";
      case "sos_log":
        return "shield-outline";
      default:
        return "journal-outline";
    }
  }

  function entryLabel(type: string) {
    switch (type) {
      case "reflection":
        return "Reflection";
      case "gratitude":
        return "Gratitude";
      case "diary_card":
        return "Diary card";
      case "sos_log":
        return "SOS log";
      default:
        return "Entry";
    }
  }

  return (
    <>
      <Modal
        visible={showNewEntry}
        animationType="slide"
        onRequestClose={() => setShowNewEntry(false)}
      >
        <NewEntryScreen
          onClose={() => {
            setShowNewEntry(false);
            loadEntries();
          }}
        />
      </Modal>
      <Modal
        visible={!!selectedEntry}
        animationType="slide"
        onRequestClose={() => setSelectedEntry(null)}
      >
        {selectedEntry && (
          <NewEntryScreen
            existingEntry={selectedEntry}
            onClose={() => {
              setSelectedEntry(null);
              loadEntries();
            }}
          />
        )}
      </Modal>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Journal</Text>
            <TouchableOpacity
              style={styles.newEntryBtn}
              onPress={() => setShowNewEntry(true)}
            >
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
            <TouchableOpacity
              style={[styles.toggleBtn, styles.toggleBtnActive]}
            >
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
                  style={[
                    styles.filterPill,
                    i === 0 && styles.filterPillActive,
                  ]}
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

          {/* Entries */}
          {loadingEntries ? (
            <ActivityIndicator color={colours.teal} size="small" />
          ) : entries.length === 0 ? (
            <View style={styles.emptyJournal}>
              <Ionicons
                name="journal-outline"
                size={32}
                color={colours.borderLight}
              />
              <Text style={styles.emptyJournalText}>No entries yet</Text>
              <Text style={styles.emptyJournalSub}>
                Tap New to write your first entry
              </Text>
            </View>
          ) : (
            entries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.entryCard}
                onPress={() => setSelectedEntry(entry)}
              >
                <View style={styles.entryTop}>
                  <View
                    style={[
                      styles.entryIcon,
                      { backgroundColor: entryColour(entry.entry_type) },
                    ]}
                  >
                    <Ionicons
                      name={entryIcon(entry.entry_type)}
                      size={14}
                      color={colours.white}
                    />
                  </View>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>
                      {entry.title || entryLabel(entry.entry_type)}
                    </Text>
                    <View style={styles.entryMeta}>
                      <Text style={styles.entryMetaText}>
                        {entryLabel(entry.entry_type)}
                      </Text>
                      <View style={styles.entryMetaDot} />
                      <Text style={styles.entryTime}>
                        {new Date(entry.created_at).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.entryPreview} numberOfLines={2}>
                  {entry.content}
                </Text>
                <View style={styles.entryTags}>
                  {entry.share_with_therapist ? (
                    <View style={styles.sharedBadge}>
                      <Ionicons
                        name="medical-outline"
                        size={10}
                        color={colours.teal}
                      />
                      <Text style={styles.sharedBadgeText}>Therapist</Text>
                    </View>
                  ) : (
                    <View style={styles.privateBadge}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={10}
                        color={colours.lightGrey}
                      />
                      <Text style={styles.privateBadgeText}>Private</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
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
  emptyJournal: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyJournalText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.textMid,
    fontWeight: "700",
  },
  emptyJournalSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textLight,
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
});
