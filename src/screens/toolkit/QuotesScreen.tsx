import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  colours,
  fonts,
  fontSizes,
  spacing,
  radius,
  minTouchTarget,
} from "../../theme/theme";
import { supabase } from "../../services/supabase";

const DEV_USER_ID = "99b6fc7e-93c5-4dfa-9192-25067d68fdff";

type Props = {
  onClose: () => void;
};

type Quote = {
  id: string;
  quote_text: string;
  source?: string;
  note?: string;
};

export default function QuotesScreen({ onClose }: Props) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadQuotes();
  }, []);

  async function loadQuotes() {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", DEV_USER_ID)
      .order("created_at", { ascending: false });
    if (!error && data) setQuotes(data);
  }

  async function handleAdd() {
    if (!quoteText.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("quotes").insert({
      user_id: DEV_USER_ID,
      quote_text: quoteText.trim(),
      source: source.trim() || null,
      note: note.trim() || null,
    });
    setSaving(false);
    if (!error) {
      setQuoteText("");
      setSource("");
      setNote("");
      setShowAdd(false);
      loadQuotes();
    }
  }

  async function handleDelete(id: string) {
    Alert.alert("Remove quote", "Are you sure you want to remove this quote?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await supabase.from("quotes").delete().eq("id", id);
          loadQuotes();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={20} color={colours.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My quotes</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAdd(!showAdd)}
        >
          <Ionicons name="add-outline" size={24} color={colours.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Add form */}
        {showAdd && (
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add a quote</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="The quote..."
              placeholderTextColor={colours.textPlaceholder}
              value={quoteText}
              onChangeText={setQuoteText}
              multiline
              textAlignVertical="top"
            />
            <TextInput
              style={styles.input}
              placeholder="Source — book, person, film (optional)"
              placeholderTextColor={colours.textPlaceholder}
              value={source}
              onChangeText={setSource}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Why does this resonate with you? (optional)"
              placeholderTextColor={colours.textPlaceholder}
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.saveBtn,
                !quoteText.trim() && styles.saveBtnDisabled,
              ]}
              onPress={handleAdd}
              disabled={!quoteText.trim() || saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Saving..." : "Add quote"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quotes */}
        {quotes.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={40}
              color={colours.borderLight}
            />
            <Text style={styles.emptyTitle}>No quotes yet</Text>
            <Text style={styles.emptySub}>
              Tap the + button to add a quote that means something to you
            </Text>
          </View>
        ) : (
          quotes.map((quote) => (
            <View key={quote.id} style={styles.quoteCard}>
              <Text style={styles.quoteText}>
                {"\u201C"}
                {quote.quote_text}
                {"\u201D"}
              </Text>
              {quote.source && (
                <Text style={styles.quoteSource}>— {quote.source}</Text>
              )}
              {quote.note && (
                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>Why it resonates</Text>
                  <Text style={styles.noteText}>{quote.note}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(quote.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colours.lightGrey}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
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
    backgroundColor: colours.mindfulness,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xl,
    color: colours.white,
    fontWeight: "700",
  },
  addBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 48,
  },
  addForm: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
  },
  addFormTitle: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.textDark,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colours.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    minHeight: minTouchTarget,
  },
  inputMultiline: {
    minHeight: 100,
  },
  saveBtn: {
    backgroundColor: colours.teal,
    borderRadius: radius.sm,
    padding: spacing.lg,
    alignItems: "center",
    minHeight: minTouchTarget,
    justifyContent: "center",
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.white,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
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
    lineHeight: 20,
  },
  quoteCard: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.xl,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    borderLeftWidth: 3,
    borderLeftColor: colours.mindfulness,
    gap: spacing.sm,
  },
  quoteText: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.lg,
    color: colours.textDark,
    fontWeight: "700",
    lineHeight: 26,
    fontStyle: "italic",
  },
  quoteSource: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textMid,
  },
  noteSection: {
    backgroundColor: colours.background,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: 2,
    marginTop: spacing.xs,
  },
  noteLabel: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  noteText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.sm,
    color: colours.textDark,
    lineHeight: 20,
  },
  deleteBtn: {
    alignSelf: "flex-end",
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
});
