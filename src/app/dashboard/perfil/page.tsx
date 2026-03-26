"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Profile, Technique } from "@/lib/types";
import {
  ArrowLeft,
  Save,
  Camera,
  Loader2,
  Check,
  X,
} from "lucide-react";

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    setUserId(user.id);

    const [profileRes, techRes, ptRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("techniques").select("*").order("nome"),
      supabase.from("profile_techniques").select("technique_id").eq("profile_id", user.id),
    ]);

    if (profileRes.data) setProfile(profileRes.data as Profile);
    if (techRes.data) setTechniques(techRes.data as Technique[]);
    if (ptRes.data) setSelectedTechIds(new Set(ptRes.data.map((r) => r.technique_id)));
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId || !profile) return;
    setSaving(true);
    setSuccess(false);

    const form = new FormData(e.currentTarget);

    const updates = {
      nome: form.get("nome") as string,
      bio: form.get("bio") as string,
      estado: form.get("estado") as string,
      cidade: form.get("cidade") as string,
      instagram: form.get("instagram") as string,
      facebook: form.get("facebook") as string,
      youtube: form.get("youtube") as string,
      linkedin: form.get("linkedin") as string,
      email_contato: form.get("email_contato") as string,
      updated_at: new Date().toISOString(),
    };

    await supabase.from("profiles").update(updates).eq("id", userId);

    // Sync techniques
    await supabase.from("profile_techniques").delete().eq("profile_id", userId);
    if (selectedTechIds.size > 0) {
      const rows = Array.from(selectedTechIds).map((tid) => ({
        profile_id: userId,
        technique_id: tid,
      }));
      await supabase.from("profile_techniques").insert(rows);
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  function toggleTechnique(id: string) {
    setSelectedTechIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploadingPhoto(true);

    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ foto_url: urlData.publicUrl })
      .eq("id", userId);

    setProfile((p) => (p ? { ...p, foto_url: urlData.publicUrl } : p));
    setUploadingPhoto(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neuro-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neuro-50/50 to-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-neuro-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-neuro-500 hover:text-neuro-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao painel
          </Link>
          <img src="/images/marca.webp" alt="Neurowork" className="h-8" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-10">
        <h1 className="animate-slide-up mb-2 text-2xl font-bold text-neuro-900">Editar Perfil</h1>
        <p className="animate-slide-up delay-100 mb-8 text-neuro-500">Preencha seus dados para aparecer na plataforma</p>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Photo */}
          <div className="animate-slide-up delay-200 rounded-2xl border border-neuro-100 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neuro-900">Foto</h2>
            <div className="flex items-center gap-5">
              <label className="relative cursor-pointer group">
                {profile?.foto_url ? (
                  <img
                    src={profile.foto_url}
                    alt="Avatar"
                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-neuro-200 group-hover:ring-neuro-400 transition-all"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-neuro-200 bg-neuro-50 text-neuro-300 group-hover:border-neuro-400 group-hover:text-neuro-500 transition-all">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                    <Loader2 className="h-5 w-5 animate-spin text-neuro-500" />
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              <div>
                <p className="text-sm font-medium text-neuro-700">Foto de perfil</p>
                <p className="text-xs text-neuro-400">JPG, PNG. Máx 2MB.</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="animate-slide-up delay-300 rounded-2xl border border-neuro-100 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neuro-900">Informações Básicas</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nome" className="text-neuro-700">Nome completo</Label>
                <Input id="nome" name="nome" defaultValue={profile?.nome ?? ""} placeholder="Seu nome" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio" className="text-neuro-700">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  defaultValue={profile?.bio ?? ""}
                  placeholder="Conte um pouco sobre você e sua experiência..."
                  className="w-full rounded-xl border border-neuro-200 bg-white px-3 py-2 text-sm placeholder:text-neuro-300 focus:border-neuro-400 focus:outline-none focus:ring-2 focus:ring-neuro-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-neuro-700">Estado</Label>
                <select
                  id="estado"
                  name="estado"
                  defaultValue={profile?.estado ?? ""}
                  className="h-11 w-full rounded-xl border border-neuro-200 bg-white px-3 text-sm focus:border-neuro-400 focus:outline-none focus:ring-2 focus:ring-neuro-400/20"
                >
                  <option value="">Selecione</option>
                  {ESTADOS_BR.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade" className="text-neuro-700">Cidade</Label>
                <Input id="cidade" name="cidade" defaultValue={profile?.cidade ?? ""} placeholder="Sua cidade" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="animate-slide-up delay-400 rounded-2xl border border-neuro-100 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neuro-900">Redes Sociais e Contato</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email_contato" className="text-neuro-700">Email de contato</Label>
                <Input id="email_contato" name="email_contato" type="email" defaultValue={profile?.email_contato ?? ""} placeholder="contato@email.com" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-neuro-700">Instagram</Label>
                <Input id="instagram" name="instagram" defaultValue={profile?.instagram ?? ""} placeholder="@seuinstagram" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-neuro-700">Facebook</Label>
                <Input id="facebook" name="facebook" defaultValue={profile?.facebook ?? ""} placeholder="facebook.com/seuperfil" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-neuro-700">YouTube</Label>
                <Input id="youtube" name="youtube" defaultValue={profile?.youtube ?? ""} placeholder="youtube.com/@seucanal" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="linkedin" className="text-neuro-700">LinkedIn</Label>
                <Input id="linkedin" name="linkedin" defaultValue={profile?.linkedin ?? ""} placeholder="linkedin.com/in/seuperfil" className="h-11 rounded-xl border-neuro-200 bg-white" />
              </div>
            </div>
          </div>

          {/* Techniques */}
          <div className="animate-slide-up delay-500 rounded-2xl border border-neuro-100 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neuro-900">Técnicas</h2>
            <p className="mb-4 text-sm text-neuro-500">Selecione as técnicas que você pratica</p>
            <div className="flex flex-wrap gap-2">
              {techniques.map((tech) => {
                const selected = selectedTechIds.has(tech.id);
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => toggleTechnique(tech.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selected
                        ? "border-neuro-400 bg-gradient-to-r from-neuro-500 to-neuro-600 text-white shadow-md shadow-neuro-500/20"
                        : "border-neuro-200 bg-white text-neuro-600 hover:border-neuro-300 hover:bg-neuro-50"
                    }`}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" /> : null}
                    {tech.nome}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-8 rounded-xl bg-gradient-to-r from-neuro-500 to-neuro-600 text-white shadow-lg shadow-neuro-500/25 hover:shadow-neuro-500/40 hover:from-neuro-600 hover:to-neuro-700 transition-all duration-300"
            >
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Salvar perfil</>
              )}
            </Button>
            {success && (
              <span className="animate-fade-in flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Check className="h-4 w-4" />
                Salvo com sucesso!
              </span>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
