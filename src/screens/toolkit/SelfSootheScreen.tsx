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

type SenseItem = {
  id: string;
  sense: string;
  item: string;
};

const SENSES = [
  {
    key: "vision",
    label: "Vision",
    icon: "eye-outline",
    colour: colours.mindfulness,
    description: "Things that are beautiful or calming to look at",
  },
  {
    key: "hearing",
    label: "Hearing",
    icon: "musical-notes-outline",
    colour: colours.distressTolerance,
    description: "Sounds that soothe or comfort you",
  },
  {
    key: "smell",
    label: "Smell",
    icon: "leaf-outline",
    colour: colours.emotionRegulation,
    description: "Scents that calm or comfort you",
  },
  {
    key: "taste",
    label: "Taste",
    icon: "restaurant-outline",
    colour: colours.interpersonal,
    description: "Foods or drinks that bring comfort",
  },
  {
    key: "touch",
    label: "Touch",
    icon: "hand-left-outline",
    colour: colours.teal,
    description: "Textures or sensations that feel soothing",
  },
];

export default function SelfSootheScreen({ onClose }: Props) {
  const [items, setItems] = useState<SenseItem[]>([]);
  const [activeSense, setActiveSense] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", DEV_USER_ID)
      .eq("setting_key", "self_soothe");
    if (!error && data && data.length > 0) {
      try {
        setItems(JSON.parse(data[0].setting_value));
      } catch {
        setItems([]);
      }
    }
  }

  async function saveItems(updatedItems: SenseItem[]) {
    const existing = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", DEV_USER_ID)
      .eq("setting_key", "self_soothe")
      .single();

    if (existing.data) {
      await supabase
        .from("user_settings")
        .update({ setting_value: JSON.stringify(updatedItems) })
        .eq("id", existing.data.id);
    } else {
      await supabase.from("user_settings").insert({
        user_id: DEV_USER_ID,
        setting_key: "self_soothe",
        setting_value: JSON.stringify(updatedItems),
      });
    }
  }

  async function handleAdd(sense: string) {
    if (!newItem.trim()) return;
    setSaving(true);
    const newItems = [
      ...items,
      { id: Date.now().toString(), sense, item: newItem.trim() },
    ];
    await saveItems(newItems);
    setItems(newItems);
    setNewItem("");
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const updated = items.filter((i) => i.id !== id);
    await saveItems(updated);
    setItems(updated);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={20} color={colours.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Self-soothe</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.intro}>
          Build your personal self-soothe kit — one comfort for each sense. Use
          these when you need to get through a difficult moment.
        </Text>

        {SENSES.map((sense) => {
          const senseItems = items.filter((i) => i.sense === sense.key);
          const isActive = activeSense === sense.key;

          return (
            <View key={sense.key} style={styles.senseSection}>
              <TouchableOpacity
                style={styles.senseHeader}
                onPress={() => setActiveSense(isActive ? null : sense.key)}
              >
                <View
                  style={[styles.senseIcon, { backgroundColor: sense.colour }]}
                >
                  <Ionicons
                    name={sense.icon as any}
                    size={18}
                    color={colours.white}
                  />
                </View>
                <View style={styles.senseBody}>
                  <Text style={styles.senseLabel}>{sense.label}</Text>
                  <Text style={styles.senseDesc}>{sense.description}</Text>
                </View>
                <Ionicons
                  name={isActive ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colours.textMid}
                />
              </TouchableOpacity>

              {isActive && (
                <View style={styles.senseContent}>
                  {senseItems.map((item) => (
                    <View key={item.id} style={styles.senseItem}>
                      <Text style={styles.senseItemText}>{item.item}</Text>
                      <TouchableOpacity onPress={() => handleDelete(item.id)}>
                        <Ionicons
                          name="close-outline"
                          size={18}
                          color={colours.lightGrey}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <View style={styles.addRow}>
                    <TextInput
                      style={styles.addInput}
                      placeholder={`Add a ${sense.label.toLowerCase()} comfort...`}
                      placeholderTextColor={colours.textPlaceholder}
                      value={newItem}
                      onChangeText={setNewItem}
                    />
                    <TouchableOpacity
                      style={[
                        styles.addItemBtn,
                        { backgroundColor: sense.colour },
                        !newItem.trim() && styles.addItemBtnDisabled,
                      ]}
                      onPress={() => handleAdd(sense.key)}
                      disabled={!newItem.trim() || saving}
                    >
                      <Ionicons
                        name="add-outline"
                        size={20}
                        color={colours.white}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
    backgroundColor: colours.emotionRegulation,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: 48,
  },
  intro: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textMid,
    lineHeight: 22,
  },
  senseSection: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    overflow: "hidden",
  },
  senseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    minHeight: minTouchTarget,
  },
  senseIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  senseBody: {
    flex: 1,
  },
  senseLabel: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  senseDesc: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 1,
  },
  senseContent: {
    borderTopWidth: 0.5,
    borderTopColor: colours.borderLight,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  senseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  senseItemText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    flex: 1,
  },
  addRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  addInput: {
    flex: 1,
    backgroundColor: colours.background,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: fontSizes.md,
    color: colours.textDark,
    minHeight: minTouchTarget,
  },
  addItemBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  addItemBtnDisabled: {
    opacity: 0.4,
  },
});
