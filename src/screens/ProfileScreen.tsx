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

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>Personalise your experience</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View
            style={[
              styles.profileAvatar,
              { backgroundColor: colours.mindfulness },
            ]}
          >
            <Text style={styles.profileAvatarText}>S</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Mitchell</Text>
            <Text style={styles.profileEmail}>sarah@email.com</Text>
            <TouchableOpacity>
              <Text style={styles.profileEdit}>Edit profile →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings menu */}
        <View style={styles.menuGroup}>
          {[
            {
              icon: "color-palette-outline",
              colour: colours.mindfulness,
              title: "Appearance",
              sub: "Colours, fonts, dark mode",
            },
            {
              icon: "accessibility-outline",
              colour: colours.distressTolerance,
              title: "Accessibility",
              sub: "Motion, contrast, sounds",
            },
            {
              icon: "notifications-outline",
              colour: colours.emotionRegulation,
              title: "Notifications",
              sub: "Reminders and alerts",
            },
            {
              icon: "medical-outline",
              colour: colours.teal,
              title: "Therapist connection",
              sub: "Dr. Patel · Connected",
              connected: true,
            },
            {
              icon: "shield-outline",
              colour: colours.interpersonal,
              title: "Data & privacy",
              sub: "Download, delete, GDPR",
            },
            {
              icon: "person-outline",
              colour: colours.cardSkills,
              title: "Account",
              sub: "Password, email, sign out",
            },
            {
              icon: "map-outline",
              colour: colours.tealDark,
              title: "Replay app tour",
              sub: "Take the guided tour again",
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuRow,
                i === 0 && styles.menuRowFirst,
                i === 6 && styles.menuRowLast,
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.colour }]}>
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={colours.white}
                />
              </View>
              <View style={styles.menuBody}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.connected && <View style={styles.connectedDot} />}
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colours.lightGrey}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger zone */}
        <TouchableOpacity style={styles.dangerRow}>
          <View style={styles.dangerBody}>
            <Text style={styles.dangerTitle}>Delete my account</Text>
            <Text style={styles.dangerSub}>
              Permanently removes all your data
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colours.dangerLight}
          />
        </TouchableOpacity>

        <Text style={styles.versionNote}>
          Wise Mind v1.0.0 · Made with care 💚
        </Text>
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
    gap: spacing.xl,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileAvatarText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.textDark,
    fontWeight: "700",
  },
  profileEmail: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textMid,
    marginTop: 2,
  },
  profileEdit: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.sm,
    color: colours.teal,
    fontWeight: "700",
    marginTop: 2,
  },
  menuGroup: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    overflow: "hidden",
  },
  menuRow: {
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: minTouchTarget,
    borderBottomWidth: 0.5,
    borderBottomColor: colours.borderLight,
  },
  menuRowFirst: {
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  menuRowLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  menuIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  menuBody: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  menuSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colours.teal,
  },
  dangerRow: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: colours.dangerLight,
    minHeight: minTouchTarget,
  },
  dangerBody: {
    flex: 1,
  },
  dangerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.danger,
    fontWeight: "700",
  },
  dangerSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  versionNote: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.lightGrey,
    textAlign: "center",
  },
});
