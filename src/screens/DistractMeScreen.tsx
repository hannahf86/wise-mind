// ============================================================
// DistractMeScreen.tsx
// Wise Mind — Distract Me AI Chat Feature
//
// SECTIONS:
// 1. Imports
// 2. Types and constants
// 3. Crisis detection keywords
// 4. System prompts
// 5. Component
//    5a. State
//    5b. Effects (timer, scroll)
//    5c. Crisis detection
//    5d. Interest picker handler
//    5e. Send message handler
//    5f. Check-in handler (14 min)
//    5g. Reset handler
//    5h. Render — Pick screen
//    5i. Render — Chat screen
// 6. Styles
// ============================================================

// ============================================================
// 1. IMPORTS
// ============================================================
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
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
import { supabase } from "../services/supabase";

// ============================================================
// 2. TYPES AND CONSTANTS
// ============================================================
const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";
const MAX_SESSION_MINUTES = 14;
const MAX_SESSION_MS = MAX_SESSION_MINUTES * 60 * 1000;

type Stage = "pick" | "chat" | "checkin" | "crisis";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
  isCrisis?: boolean;
  isCheckin?: boolean;
};

type Interest = {
  id: string;
  name: string;
};

// ============================================================
// 3. CRISIS DETECTION KEYWORDS
// ============================================================
const CRISIS_KEYWORDS = [
  "suicide",
  "suicidal",
  "kill myself",
  "end my life",
  "want to die",
  "don't want to be here",
  "dont want to be here",
  "not want to be here",
  "self harm",
  "self-harm",
  "hurt myself",
  "cut myself",
  "cutting myself",
  "overdose",
  "take pills",
  "hanging",
  "jump off",
  "jump from",
  "better off dead",
  "better off without me",
  "no reason to live",
  "can't go on",
  "cant go on",
  "give up on life",
  "ending it all",
  "end it all",
  "ending everything",
];

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((keyword) => lower.includes(keyword));
}

// ============================================================
// 4. SYSTEM PROMPTS
// ============================================================
function buildSystemPrompt(
  interestName: string,
  distressLevel: number,
): string {
  const tone =
    distressLevel >= 4
      ? "The user is quite distressed so be especially warm, gentle and grounding."
      : distressLevel >= 3
        ? "The user is moderately stressed — be warm and upbeat."
        : "The user seems relatively calm — be friendly, curious and a bit banter-y.";

  return `You are a warm, friendly conversation partner for Wise Mind, a mental health app for neurodivergent people.

Your job right now is to help the user feel grounded and distracted from distress by having a genuinely engaging conversation about something they love.

The user has chosen to talk about: ${interestName}

${tone}

RULES:
- Ask one question at a time — never more than one
- After the user answers, respond with genuine interest (1-2 sentences) then ask a follow-up question
- Keep your responses SHORT — 2-4 sentences maximum
- Be conversational, warm and a little playful — not clinical
- NEVER discuss suicide, self-harm, or crisis topics — if the user mentions anything like this, you must stop the conversation immediately and say: "I care about you and I want to make sure you're safe. Please reach out to a crisis service right now." Do not elaborate further.
- If the user says they feel better or want to stop, congratulate them warmly and encourage them to check in with their journal
- Stay focused on the topic — gently steer back if they drift

Start by warmly welcoming them and asking your very first question about ${interestName}. Keep it to 2-3 sentences.`;
}

const CRISIS_MESSAGE = `I'm really glad you're talking to me, but I want to make sure you get the right support right now.

Please reach out to one of these services — they're available 24/7 and are there for exactly this:

📞 **Samaritans** — 116 123 (free, 24/7)
💬 **SHOUT** — text SHOUT to 85258 (free, 24/7)
📞 **NHS urgent mental health** — 111, then press 2

You don't have to be in immediate danger to call. If you're struggling, please reach out. 💚`;

const CHECKIN_MESSAGE = `Hey — we've been chatting for a little while now. How are you feeling? 

Take a moment to check in with yourself — notice your breath, your body, how you feel compared to when we started. 

Are you feeling a bit better, or are you still struggling?`;

// ============================================================
// 5. COMPONENT
// ============================================================
export default function DistractMeScreen() {
  // ----------------------------------------------------------
  // 5a. STATE
  // ----------------------------------------------------------
  const [stage, setStage] = useState<Stage>("pick");
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(
    null,
  );
  const [distressLevel, setDistressLevel] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [checkinDone, setCheckinDone] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ----------------------------------------------------------
  // 5b. EFFECTS
  // ----------------------------------------------------------

  // Load interests from Supabase on mount
  useEffect(() => {
    loadInterests();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  async function loadInterests() {
    const { data, error } = await supabase
      .from("special_interests")
      .select("id, name")
      .eq("user_id", DEV_USER_ID)
      .order("order_index", { ascending: true });

    if (!error && data) setInterests(data);
    setLoadingInterests(false);
  }

  // Start the 14-minute session timer
  function startSessionTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleCheckin();
    }, MAX_SESSION_MS);
  }

  // ----------------------------------------------------------
  // 5c. CRISIS DETECTION
  // ----------------------------------------------------------
  function handleCrisisDetected() {
    // Stop the session timer
    if (timerRef.current) clearTimeout(timerRef.current);

    const crisisMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: CRISIS_MESSAGE,
      isCrisis: true,
    };
    setMessages((prev) => [...prev, crisisMsg]);
    setStage("crisis");
  }

  // ----------------------------------------------------------
  // 5d. INTEREST PICKER HANDLER
  // ----------------------------------------------------------
  async function handlePickInterest(interest: Interest) {
    setSelectedInterest(interest);
    setGenerating(true);
    setStage("chat");
    startSessionTimer();

    const systemPrompt = buildSystemPrompt(interest.name, distressLevel || 2);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          system: systemPrompt,
          messages: [
            { role: "user", content: `I want to talk about ${interest.name}` },
          ],
        }),
      });

      const data = await response.json();
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: data.content[0].text,
        },
      ]);
    } catch (error) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Let's talk about ${interest.name}! What first got you interested in it?`,
        },
      ]);
    }
    setGenerating(false);
  }

  // ----------------------------------------------------------
  // 5e. SEND MESSAGE HANDLER
  // ----------------------------------------------------------
  async function handleSend() {
    if (!input.trim() || loading || stage === "crisis") return;

    const userText = input.trim();

    // Crisis check — always runs first
    if (detectCrisis(userText)) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: userText,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      handleCrisisDetected();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = buildSystemPrompt(
      selectedInterest?.name || "",
      distressLevel || 2,
    );

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          system: systemPrompt,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      console.log("API response:", JSON.stringify(data));

      if (data.error) {
        console.log("API error:", data.error.message);
        setLoading(false);
        return;
      }

      const assistantMessage: Message = {
        id: Date.now().toString() + "a",
        role: "assistant",
        content: data.content[0].text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.log("Send error:", error);
    }

    setLoading(false);
  }

  // ----------------------------------------------------------
  // 5f. CHECK-IN HANDLER (14 MINUTES)
  // ----------------------------------------------------------
  function handleCheckin() {
    if (checkinDone) return;
    setCheckinDone(true);

    const checkinMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: CHECKIN_MESSAGE,
      isCheckin: true,
    };
    setMessages((prev) => [...prev, checkinMsg]);
    setStage("checkin");
  }

  async function handleCheckinResponse(feelingBetter: boolean) {
    if (feelingBetter) {
      const goodMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `That's really good to hear 💚 You did well today. Why not write a few thoughts in your journal to capture how you're feeling right now?`,
      };
      setMessages((prev) => [...prev, goodMsg]);
      setStage("chat");
    } else {
      // Still struggling — show crisis resources
      const stillMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I hear you — it's okay to still be struggling. If things feel really difficult right now, please do reach out for support:

📞 **Samaritans** — 116 123 (free, 24/7)
💬 **SHOUT** — text SHOUT to 85258 (free, 24/7)
📞 **NHS urgent mental health** — 111, then press 2

You can also head to the SOS tab in Wise Mind for more resources. You're not alone 💚`,
      };
      setMessages((prev) => [...prev, stillMsg]);
      setStage("chat");
    }
  }

  // ----------------------------------------------------------
  // 5g. RESET HANDLER
  // ----------------------------------------------------------
  function handleReset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage("pick");
    setSelectedInterest(null);
    setDistressLevel(null);
    setMessages([]);
    setInput("");
    setCheckinDone(false);
  }

  // ----------------------------------------------------------
  // 5h. RENDER — DISTRESS SCALE (shown before interest picker)
  // ----------------------------------------------------------
  if (distressLevel === null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Distract Me</Text>
          <Text style={styles.headerSub}>Let's get you out of your head</Text>
        </View>
        <View style={styles.scaleContainer}>
          <Text style={styles.scaleHeading}>
            How are you feeling right now?
          </Text>
          <Text style={styles.scaleSub}>
            Be honest — this helps me pitch the conversation right for you.
          </Text>
          <View style={styles.scaleRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.scaleBtn,
                  level <= 2 && styles.scaleBtnGreen,
                  level === 3 && styles.scaleBtnAmber,
                  level >= 4 && styles.scaleBtnOrange,
                ]}
                onPress={() => setDistressLevel(level)}
              >
                <Text style={styles.scaleBtnNumber}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabelLeft}>Pretty okay</Text>
            <Text style={styles.scaleLabelRight}>Really struggling</Text>
          </View>
        </View>
      </View>
    );
  }

  // ----------------------------------------------------------
  // 5i. RENDER — INTEREST PICKER
  // ----------------------------------------------------------
  if (stage === "pick") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Distract Me</Text>
          <Text style={styles.headerSub}>
            Pick something you love and we'll talk about it
          </Text>
        </View>

        {loadingInterests ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colours.teal} size="large" />
          </View>
        ) : interests.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Ionicons
              name="star-outline"
              size={40}
              color={colours.borderLight}
            />
            <Text style={styles.emptyTitle}>No interests yet</Text>
            <Text style={styles.emptySub}>
              Add your special interests in your profile settings
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>
              What do you want to talk about?
            </Text>
            <View style={styles.interestGrid}>
              {interests.map((interest) => (
                <TouchableOpacity
                  key={interest.id}
                  style={styles.interestChip}
                  onPress={() => handlePickInterest(interest)}
                >
                  <Ionicons
                    name="star-outline"
                    size={18}
                    color={colours.teal}
                  />
                  <Text style={styles.interestName}>{interest.name}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colours.lightGrey}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  // ----------------------------------------------------------
  // 5j. RENDER — CHAT SCREEN
  // ----------------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={20} color={colours.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name="star-outline" size={16} color={colours.white} />
          <Text style={styles.headerTitle}>{selectedInterest?.name}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {generating ? (
          <View style={styles.generatingRow}>
            <ActivityIndicator color={colours.teal} size="small" />
            <Text style={styles.generatingText}>Getting ready...</Text>
          </View>
        ) : (
          messages.map((message) => {
            // Crisis message — special styling
            if (message.isCrisis) {
              return (
                <View key={message.id} style={styles.crisisCard}>
                  <View style={styles.crisisTitleRow}>
                    <Ionicons
                      name="heart-outline"
                      size={18}
                      color={colours.danger}
                    />
                    <Text style={styles.crisisTitle}>Please reach out</Text>
                  </View>
                  <Text style={styles.crisisText}>{message.content}</Text>
                </View>
              );
            }

            // Check-in message — special buttons
            if (message.isCheckin) {
              return (
                <View key={message.id}>
                  <View style={[styles.messageBubble, styles.assistantBubble]}>
                    <Text style={styles.assistantText}>{message.content}</Text>
                  </View>
                  {stage === "checkin" && (
                    <View style={styles.checkinBtns}>
                      <TouchableOpacity
                        style={styles.checkinBtnGood}
                        onPress={() => handleCheckinResponse(true)}
                      >
                        <Text style={styles.checkinBtnText}>
                          I'm feeling better 💚
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.checkinBtnStruggling}
                        onPress={() => handleCheckinResponse(false)}
                      >
                        <Text style={styles.checkinBtnTextDark}>
                          Still struggling
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }

            // Regular message
            return (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.role === "user"
                    ? styles.userBubble
                    : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    message.role === "user"
                      ? styles.userText
                      : styles.assistantText,
                  ]}
                >
                  {message.content}
                </Text>
              </View>
            );
          })
        )}

        {loading && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator color={colours.teal} size="small" />
          </View>
        )}
      </ScrollView>

      {/* Input — hidden in crisis mode */}
      {stage !== "crisis" && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your answer..."
            placeholderTextColor={colours.textPlaceholder}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!input.trim() || loading) && styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={18} color={colours.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Crisis mode — show exit button instead of input */}
      {stage === "crisis" && (
        <View style={styles.crisisFooter}>
          <TouchableOpacity style={styles.crisisExitBtn} onPress={handleReset}>
            <Text style={styles.crisisExitText}>Close chat</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// ============================================================
// 6. STYLES
// ============================================================
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
  backBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: colours.white,
    fontWeight: "700",
  },
  headerSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },

  // Scale screen
  scaleContainer: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    gap: spacing.xl,
  },
  scaleHeading: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xxl,
    color: colours.textDark,
    fontWeight: "700",
    textAlign: "center",
  },
  scaleSub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    textAlign: "center",
    lineHeight: 22,
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  scaleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  scaleBtnGreen: {
    backgroundColor: colours.teal,
  },
  scaleBtnAmber: {
    backgroundColor: colours.distressTolerance,
  },
  scaleBtnOrange: {
    backgroundColor: colours.warning,
  },
  scaleBtnNumber: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: colours.white,
    fontWeight: "700",
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  scaleLabelLeft: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
  },
  scaleLabelRight: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
  },

  // Interest picker
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.textMid,
    fontWeight: "700",
  },
  emptySub: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textLight,
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  interestGrid: {
    gap: spacing.sm,
  },
  interestChip: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: minTouchTarget,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  interestName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
    flex: 1,
  },

  // Chat
  chatContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: 32,
  },
  generatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
  },
  generatingText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textMid,
  },
  messageBubble: {
    maxWidth: "85%",
    borderRadius: radius.md,
    padding: spacing.md,
  },
  assistantBubble: {
    backgroundColor: colours.white,
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  userBubble: {
    backgroundColor: colours.teal,
    alignSelf: "flex-end",
  },
  assistantText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    lineHeight: 22,
  },
  userText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.white,
    lineHeight: 22,
  },
  typingIndicator: {
    padding: spacing.md,
    alignSelf: "flex-start",
  },

  // Check-in
  checkinBtns: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  checkinBtnGood: {
    backgroundColor: colours.teal,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  checkinBtnStruggling: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colours.borderLight,
  },
  checkinBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.white,
    fontWeight: "700",
  },
  checkinBtnTextDark: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textMid,
    fontWeight: "700",
  },

  // Crisis
  crisisCard: {
    backgroundColor: colours.dangerLight,
    borderRadius: radius.md,
    padding: spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: colours.danger,
    gap: spacing.md,
  },
  crisisTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  crisisTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.danger,
    fontWeight: "700",
  },
  crisisText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    lineHeight: 24,
  },
  crisisFooter: {
    padding: spacing.xl,
    backgroundColor: colours.white,
    borderTopWidth: 0.5,
    borderTopColor: colours.borderLight,
  },
  crisisExitBtn: {
    backgroundColor: colours.background,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colours.borderLight,
  },
  crisisExitText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textMid,
    fontWeight: "700",
  },

  // Input
  inputRow: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colours.white,
    borderTopWidth: 0.5,
    borderTopColor: colours.borderLight,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: colours.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    maxHeight: 100,
    minHeight: minTouchTarget,
  },
  sendBtn: {
    backgroundColor: colours.teal,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
