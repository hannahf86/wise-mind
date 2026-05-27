import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import {
  colours,
  fonts,
  fontSizes,
  spacing,
  radius,
  minTouchTarget,
} from "../../theme/theme";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "exp://192.168.1.143:8081/--/auth",
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.sentCard}>
          <Text style={styles.sentEmoji}>💚</Text>
          <Text style={styles.sentTitle}>Check your email</Text>
          <Text style={styles.sentText}>
            We've sent a sign in link to{"\n"}
            <Text style={styles.sentEmail}>{email}</Text>
          </Text>
          <Text style={styles.sentSub}>
            Tap the link in the email and you'll be taken straight into Wise
            Mind.
          </Text>
          <TouchableOpacity onPress={() => setSent(false)}>
            <Text style={styles.sentBack}>Use a different email</Text>
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
      <View style={styles.inner}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoMark}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.logoTitle}>Wise Mind</Text>
          <Text style={styles.logoSub}>Your DBT skills, your way.</Text>
        </View>

        {/* Sign in form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign in or create an account</Text>
          <Text style={styles.formSub}>
            Enter your email and we'll send you a sign in link — no password
            needed.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={colours.textPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.signInBtnText}>
              {loading ? "Sending..." : "Send sign in link"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By continuing you agree to our Terms of Service and Privacy Policy.
            Your data is protected under GDPR.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  inner: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    gap: spacing.xxl,
  },
  logoArea: {
    alignItems: "center",
    gap: spacing.sm,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colours.teal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxxl,
    color: colours.teal,
    fontWeight: "700",
  },
  logoSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
  },
  form: {
    gap: spacing.md,
  },
  formTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: colours.textDark,
    fontWeight: "700",
  },
  formSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    lineHeight: 22,
  },
  input: {
    backgroundColor: colours.white,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    minHeight: minTouchTarget,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.danger,
  },
  signInBtn: {
    backgroundColor: colours.teal,
    borderRadius: radius.sm,
    padding: spacing.lg,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  signInBtnDisabled: {
    opacity: 0.6,
  },
  signInBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.white,
    fontWeight: "700",
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textLight,
    textAlign: "center",
    lineHeight: 16,
  },
  sentCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  sentEmoji: {
    fontSize: 48,
  },
  sentTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    fontWeight: "700",
  },
  sentText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    textAlign: "center",
    lineHeight: 24,
  },
  sentEmail: {
    fontFamily: fonts.heading,
    color: colours.teal,
    fontWeight: "700",
  },
  sentSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    textAlign: "center",
    lineHeight: 22,
  },
  sentBack: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.teal,
    fontWeight: "700",
  },
});
