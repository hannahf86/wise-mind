import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Linking,
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

type Playlist = {
  id: string;
  name: string;
  url: string;
  description?: string;
};

export default function PlaylistsScreen({ onClose }: Props) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function loadPlaylists() {
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("user_id", DEV_USER_ID)
      .order("created_at", { ascending: false });
    if (!error && data) setPlaylists(data);
  }

  async function handleAdd() {
    if (!name.trim() || !url.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("playlists").insert({
      user_id: DEV_USER_ID,
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || null,
    });
    setSaving(false);
    if (!error) {
      setName("");
      setUrl("");
      setDescription("");
      setShowAdd(false);
      loadPlaylists();
    }
  }

  async function handleDelete(id: string) {
    Alert.alert(
      "Remove playlist",
      "Are you sure you want to remove this playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await supabase.from("playlists").delete().eq("id", id);
            loadPlaylists();
          },
        },
      ],
    );
  }

  function handleOpen(url: string) {
    Linking.openURL(url).catch(() =>
      Alert.alert("Could not open link", "Make sure the URL is correct."),
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={20} color={colours.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My playlists</Text>
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
            <Text style={styles.addFormTitle}>Add a playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              placeholderTextColor={colours.textPlaceholder}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Spotify / Apple Music URL"
              placeholderTextColor={colours.textPlaceholder}
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              placeholderTextColor={colours.textPlaceholder}
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity
              style={[
                styles.saveBtn,
                (!name.trim() || !url.trim()) && styles.saveBtnDisabled,
              ]}
              onPress={handleAdd}
              disabled={!name.trim() || !url.trim() || saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? "Saving..." : "Add playlist"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Playlists */}
        {playlists.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="musical-notes-outline"
              size={40}
              color={colours.borderLight}
            />
            <Text style={styles.emptyTitle}>No playlists yet</Text>
            <Text style={styles.emptySub}>
              Tap the + button to add a playlist
            </Text>
          </View>
        ) : (
          playlists.map((playlist) => (
            <View key={playlist.id} style={styles.playlistCard}>
              <View style={styles.playlistIcon}>
                <Ionicons
                  name="musical-notes-outline"
                  size={20}
                  color={colours.distressTolerance}
                />
              </View>
              <View style={styles.playlistBody}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
                {playlist.description && (
                  <Text style={styles.playlistDesc}>
                    {playlist.description}
                  </Text>
                )}
              </View>
              <View style={styles.playlistActions}>
                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => handleOpen(playlist.url)}
                >
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={colours.teal}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(playlist.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colours.lightGrey}
                  />
                </TouchableOpacity>
              </View>
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
    backgroundColor: colours.distressTolerance,
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
  },
  playlistCard: {
    backgroundColor: colours.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 0.5,
    borderColor: colours.borderLight,
    minHeight: minTouchTarget,
  },
  playlistIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colours.distressTolerance + "20",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  playlistBody: {
    flex: 1,
  },
  playlistName: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.md,
    color: colours.textDark,
    fontWeight: "700",
  },
  playlistDesc: {
    fontFamily: fonts.body,
    fontSize: fontSizes.xs,
    color: colours.textMid,
    marginTop: 2,
  },
  playlistActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  openBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: "center",
    justifyContent: "center",
  },
});
