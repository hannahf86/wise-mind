// TODO: Re-enable RLS on mood_logs table before beta
// Currently disabled for development — enable in Supabase dashboard
// Authentication → Policies → mood_logs

import { supabase } from "./supabase";

export type MoodType = "low" | "okay" | "good" | "great";

const moodScores: Record<MoodType, number> = {
  low: 1,
  okay: 2,
  good: 3,
  great: 4,
};

export async function logMood(mood: MoodType, userId: string) {
  const { data, error } = await supabase.from("mood_logs").insert({
    user_id: userId,
    mood,
    mood_score: moodScores[mood],
  });

  if (error) {
    console.log("Mood log error:", error.message);
    return false;
  }
  return true;
}

export async function getMoodLogs(userId: string) {
  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(7);

  if (error) {
    console.log("Get mood logs error:", error.message);
    return [];
  }
  return data;
}
