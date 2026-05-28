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
} from "react-native";
import { useState } from "react";
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

const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";

type Stage = "pick" | "questions" | "chat";

type Message = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

const DEFAULT_INTERESTS = [
  { name: "Space & astronomy", icon: "telescope-outline" },
  { name: "Animals & wildlife", icon: "paw-outline" },
  { name: "History & archaeology", icon: "time-outline" },
  { name: "Music", icon: "musical-notes-outline" },
  { name: "Gaming", icon: "game-controller-outline" },
  { name: "Books & reading", icon: "book-outline" },
  { name: "Nature & plants", icon: "leaf-outline" },
  { name: "Cooking & food", icon: "restaurant-outline" },
  { name: "Art & creativity", icon: "color-palette-outline" },
  { name: "Sport & fitness", icon: "bicycle-outline" },
  { name: "Film & TV", icon: "film-outline" },
  { name: "Science & technology", icon: "flask-outline" },
];

export default function DistractMeScreen() {
  const [stage, setStage] = useState<Stage>("pick");
  const [selectedInterest, setSelectedInterest] = useState<{
    name: string;
    icon: string;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function handlePickInterest(interest: { name: string; emoji: string }) {
    setSelectedInterest(interest);
    setGenerating(true);
    setStage("chat");

    const systemPrompt = `You are a warm, curious conversation partner helping someone with anxiety or emotional distress to ground themselves by talking about something they love.

The user has chosen to talk about: ${interest.name}

Your job is to ask genuinely curious, engaging questions about this topic — one at a time. Keep questions light, specific and interesting. Avoid anything that could increase anxiety. Be warm and enthusiastic about their interest. After they answer, respond briefly with genuine interest, then ask your next question.

Start by warmly welcoming them and asking your first question about ${interest.name}. Keep your opening message to 2-3 sentences maximum.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `I want to talk about ${interest.name}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const firstMessage = data.content[0].text;

      setMessages([
        {
          id: "1",
          role: "assistant",
          content: firstMessage,
        },
      ]);
    } catch (error) {
      console.log("Distract Me error:", error);
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

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = `You are a warm, curious conversation partner helping someone with anxiety or emotional distress to ground themselves by talking about something they love.

The user has chosen to talk about: ${selectedInterest?.name}

Your job is to ask genuinely curious, engaging questions about this topic — one at a time. Keep questions light, specific and interesting. Avoid anything that could increase anxiety. Be warm and enthusiastic about their interest. After they answer, respond briefly with genuine interest, then ask your next question. Keep responses to 2-3 sentences maximum.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
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

  function handleReset() {
    setStage("pick");
    setSelectedInterest(null);
    setMessages([]);
    setInput("");
  }

  if (stage === "pick") {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Distract Me</Text>
          <Text style={styles.headerSub}>
            Pick something you love and we'll talk about it
          </Text>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Choose a topic</Text>
          <View style={styles.interestGrid}>
            {DEFAULT_INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest.name}
                style={styles.interestChip}
                onPress={() => handlePickInterest(interest)}
              >
                <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                <Text style={styles.interestName}>{interest.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

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
          <Text style={styles.headerInterestEmoji}>
            {selectedInterest?.emoji}
          </Text>
          <Text style={styles.headerTitle}>{selectedInterest?.name}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {generating ? (
          <View style={styles.generatingRow}>
            <ActivityIndicator color={colours.teal} size="small" />
            <Text style={styles.generatingText}>Getting ready...</Text>
          </View>
        ) : (
          messages.map((message) => (
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
                  styles.messageText,
                  message.role === "user"
                    ? styles.userText
                    : styles.assistantText,
                ]}
              >
                {message.content}
              </Text>
            </View>
          ))
        )}
        {loading && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator color={colours.teal} size="small" />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your answer..."
          placeholderTextColor={colours.textPlaceholder}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
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
    </KeyboardAvoidingView>
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
  backBtn: {
    width: 44,
    height: 44,
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
  headerInterestEmoji: {
    fontSize: 18,
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
    marginBottom: spacing.sm,
  },
  interestGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  interestChip: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    width: "47%",
    minHeight: minTouchTarget,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  interestEmoji: {
    fontSize: 20,
  },
  interestName: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textDark,
    flex: 1,
  },
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
  messageText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  assistantText: {
    color: colours.textDark,
  },
  userText: {
    color: colours.white,
  },
  typingIndicator: {
    padding: spacing.md,
    alignSelf: "flex-start",
  },
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
