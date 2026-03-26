import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Users,
  Zap,
  MapPin,
  ArrowLeft,
  Trash2,
  Eye,
} from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check admin role
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Stats
  const [profilesRes, techniquesRes, ptRes] = await Promise.all([
    supabase.from("profiles").select("id, nome, email_contato, estado, cidade, role, created_at").order("created_at", { ascending: false }),
    supabase.from("techniques").select("*").order("nome"),
    supabase.from("profile_techniques").select("profile_id"),
  ]);

  const profiles = profilesRes.data ?? [];
  const techniques = techniquesRes.data ?? [];
  const totalWithTechniques = new Set(ptRes.data?.map((r) => r.profile_id)).size;
  const completedProfiles = profiles.filter((p) => p.nome).length;
  const statesSet = new Set(profiles.map((p) => p.estado).filter(Boolean));

  return (
    <div className="min-h-screen bg-gradient-to-b from-neuro-50/50 to-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-neuro-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-neuro-500 hover:text-neuro-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Painel
          </Link>
          <div className="flex items-center gap-3">
            <img src="/images/marca.webp" alt="Neurowork" className="h-8" />
            <span className="text-sm font-semibold text-neuro-900">Admin</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-10">
        <h1 className="animate-slide-up mb-2 text-2xl font-bold text-neuro-900">
          Painel Administrativo
        </h1>
        <p className="animate-slide-up delay-100 mb-8 text-neuro-500">
          Gerencie usuários, técnicas e monitore a plataforma
        </p>

        {/* Stats Cards */}
        <div className="animate-slide-up delay-200 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "Usuários", value: profiles.length, color: "text-blue-600 bg-blue-50 border-blue-100" },
            { icon: Users, label: "Perfis Completos", value: completedProfiles, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
            { icon: Zap, label: "Com Técnicas", value: totalWithTechniques, color: "text-violet-600 bg-violet-50 border-violet-100" },
            { icon: MapPin, label: "Estados", value: statesSet.size, color: "text-amber-600 bg-amber-50 border-amber-100" },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center gap-3 rounded-xl border p-4 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
              <div>
                <p className="text-xs font-medium opacity-70">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Users Table */}
          <div className="animate-slide-up delay-300 rounded-2xl border border-neuro-100 bg-white overflow-hidden">
            <div className="border-b border-neuro-50 px-6 py-4">
              <h2 className="font-semibold text-neuro-900">Usuários ({profiles.length})</h2>
            </div>
            <div className="divide-y divide-neuro-50">
              {profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between px-6 py-3 hover:bg-neuro-50/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neuro-800 truncate">
                      {profile.nome || <span className="italic text-neuro-300">Sem nome</span>}
                    </p>
                    <p className="text-xs text-neuro-400">
                      {profile.email_contato || "—"}{" "}
                      {profile.estado && `· ${profile.cidade ? `${profile.cidade}, ` : ""}${profile.estado}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.role === "admin" && (
                      <span className="rounded-full bg-neuro-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        ADMIN
                      </span>
                    )}
                    <Link href={`/profissionais/${profile.id}`}>
                      <Button variant="ghost" size="icon-xs" className="text-neuro-400 hover:text-neuro-700">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              {profiles.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-neuro-400">
                  Nenhum usuário cadastrado ainda.
                </div>
              )}
            </div>
          </div>

          {/* Techniques Management */}
          <div className="space-y-4">
            <div className="animate-slide-up delay-400 rounded-2xl border border-neuro-100 bg-white p-6">
              <h2 className="mb-4 font-semibold text-neuro-900">Técnicas ({techniques.length})</h2>
              <div className="space-y-2">
                {techniques.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between rounded-xl border border-neuro-100 p-3 text-sm"
                  >
                    <span className="font-medium text-neuro-700 leading-tight">{tech.nome}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-neuro-400">
                Em breve: criar, editar e remover técnicas.
              </p>
            </div>

            {/* Quick actions */}
            <div className="animate-slide-up delay-500 rounded-2xl border border-neuro-100 bg-white p-6">
              <h2 className="mb-4 font-semibold text-neuro-900">Ações Rápidas</h2>
              <div className="space-y-2">
                <Link href="/profissionais" className="flex items-center gap-2 rounded-xl border border-neuro-100 p-3 text-sm font-medium text-neuro-700 hover:bg-neuro-50 transition-colors">
                  <Users className="h-4 w-4 text-neuro-400" />
                  Ver listagem pública
                </Link>
                <Link href="/mapa" className="flex items-center gap-2 rounded-xl border border-neuro-100 p-3 text-sm font-medium text-neuro-700 hover:bg-neuro-50 transition-colors">
                  <MapPin className="h-4 w-4 text-neuro-400" />
                  Ver mapa interativo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
