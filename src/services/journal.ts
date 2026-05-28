// TODO: Re-enable RLS on journal_entries table before beta
// Currently disabled for development — enable in Supabase dashboard

import { supabase } from "./supabase";

export type EntryType = "reflection" | "diary_card" | "sos_log" | "gratitude";

export async function saveJournalEntry(
  userId: string,
  entryType: EntryType,
  content: string,
  sharedWithTherapist: boolean = false,
  title?: string,
) {
  const { data, error } = await supabase.from("journal_entries").insert({
    user_id: userId,
    entry_type: entryType,
    content,
    share_with_therapist: sharedWithTherapist,
    ...(title && { title }),
  });

  if (error) {
    console.log("Journal save error:", error.message);
    return false;
  }
  return true;
}

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.log("Get journal entries error:", error.message);
    return [];
  }
  return data;
}
