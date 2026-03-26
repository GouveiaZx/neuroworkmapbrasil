"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Not admin");
  return supabase;
}

export async function createTechnique(formData: FormData) {
  const nome = (formData.get("nome") as string)?.trim().toUpperCase();
  if (!nome) return { error: "Nome é obrigatório" };

  const supabase = await assertAdmin();
  const { error } = await supabase.from("techniques").insert({ nome });

  if (error) {
    if (error.code === "23505") return { error: "Técnica já existe" };
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function updateTechnique(formData: FormData) {
  const id = formData.get("id") as string;
  const nome = (formData.get("nome") as string)?.trim().toUpperCase();
  if (!nome) return { error: "Nome é obrigatório" };

  const supabase = await assertAdmin();
  const { error } = await supabase
    .from("techniques")
    .update({ nome })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") return { error: "Técnica já existe" };
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteTechnique(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = await assertAdmin();

  // First remove associations
  await supabase.from("profile_techniques").delete().eq("technique_id", id);

  const { error } = await supabase.from("techniques").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = await assertAdmin();

  // Remove profile techniques
  await supabase.from("profile_techniques").delete().eq("profile_id", id);

  // Remove profile
  await supabase.from("profiles").delete().eq("id", id);

  revalidatePath("/admin");
  return { success: true };
}
