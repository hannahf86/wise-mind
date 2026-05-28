// TODO: Re-enable RLS on favourite_skills table before beta

import { supabase } from "./supabase";

const MAX_FAVOURITES = 5;

export async function getFavouriteSkills(userId: string) {
  const { data, error } = await supabase
    .from("favourite_skills")
    .select("*, skills(id, name, description, icon, module_id)")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });

  if (error) {
    console.log("Get favourites error:", error.message);
    return [];
  }
  return data;
}

export async function addFavouriteSkill(userId: string, skillId: string) {
  // Check current count first
  const { data: existing } = await supabase
    .from("favourite_skills")
    .select("id")
    .eq("user_id", userId);

  if (existing && existing.length >= MAX_FAVOURITES) {
    return { success: false, reason: "max_reached" };
  }

  // Check not already favourited
  const { data: duplicate } = await supabase
    .from("favourite_skills")
    .select("id")
    .eq("user_id", userId)
    .eq("skill_id", skillId)
    .single();

  if (duplicate) {
    return { success: false, reason: "already_added" };
  }

  const { error } = await supabase.from("favourite_skills").insert({
    user_id: userId,
    skill_id: skillId,
    order_index: existing ? existing.length : 0,
  });

  if (error) {
    console.log("Add favourite error:", error.message);
    return { success: false, reason: "error" };
  }
  return { success: true };
}

export async function removeFavouriteSkill(userId: string, skillId: string) {
  const { error } = await supabase
    .from("favourite_skills")
    .delete()
    .eq("user_id", userId)
    .eq("skill_id", skillId);

  if (error) {
    console.log("Remove favourite error:", error.message);
    return false;
  }
  return true;
}

export async function getAllSkills() {
  const { data, error } = await supabase
    .from("skills")
    .select("*, modules(name, colour)")
    .order("order_index", { ascending: true });

  if (error) {
    console.log("Get skills error:", error.message);
    return [];
  }
  return data;
}
