import { supabase } from "./supabase";

export async function getModules() {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.log("Get modules error:", error.message);
    return [];
  }
  return data;
}

export async function getLessons(moduleId: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index", { ascending: true });

  if (error) {
    console.log("Get lessons error:", error.message);
    return [];
  }
  return data;
}
