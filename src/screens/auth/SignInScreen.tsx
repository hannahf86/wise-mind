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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOtp() {
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
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  async function handleVerifyOtp() {
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit code from your email");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase().trim(),
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    // If successful, AuthContext picks up the session automatically
  }

  if (sent) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.inner}>
          <View style={styles.logoArea}>
            <View style={styles.logoMark}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.logoTitle}>Wise Mind</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Check your email</Text>
            <Text style={styles.formSub}>
              We sent a 6-digit code to{"\n"}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>

            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor={colours.textPlaceholder}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.signInBtn, loading && styles.signInBtnDisabled]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              <Text style={styles.signInBtnText}>
                {loading ? "Verifying..." : "Verify code"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSent(false);
                setOtp("");
                setError(null);
              }}
            >
              <Text style={styles.backLink}>Use a different email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <View style={styles.logoArea}>
          <View style={styles.logoMark}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.logoTitle}>Wise Mind</Text>
          <Text style={styles.logoSub}>Your DBT skills, your way.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign in or create an account</Text>
          <Text style={styles.formSub}>
            Enter your email and we'll send you a 6-digit sign in code — no
            password needed.
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
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.signInBtnText}>
              {loading ? "Sending..." : "Send code"}
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
  emailHighlight: {
    fontFamily: fonts.heading,
    color: colours.teal,
    fontWeight: "700",
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
  backLink: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.teal,
    fontWeight: "700",
    textAlign: "center",
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textLight,
    textAlign: "center",
    lineHeight: 16,
  },
});
