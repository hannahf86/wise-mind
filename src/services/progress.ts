// TODO: Re-enable RLS on user_progress table before beta
// Currently disabled for development — enable in Supabase dashboard

import { supabase } from "./supabase";

export async function startModule(userId: string, moduleId: string) {
  const { data, error } = await supabase.from("user_progress").insert({
    user_id: userId,
    module_id: moduleId,
    status: "in_progress",
    completed: false,
    started_at: new Date().toISOString(),
  });

  if (error) {
    console.log("Start module error:", error.message);
    return false;
  }
  return true;
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*, modules(title, colour)")
    .eq("user_id", userId);

  if (error) {
    console.log("Get progress error:", error.message);
    return [];
  }
  return data;
}
