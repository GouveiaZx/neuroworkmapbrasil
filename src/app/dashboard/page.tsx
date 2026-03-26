import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Zap,
  Settings,
  LogOut,
  Camera,
  Globe,
  Mail,
  Link2,
  Video,
  AtSign,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch techniques
  const { data: techniques } = await supabase.from("techniques").select("*");

  // Fetch user's selected techniques
  const { data: userTechniques } = await supabase
    .from("profile_techniques")
    .select("technique_id")
    .eq("profile_id", user.id);

  const selectedTechIds = new Set(
    userTechniques?.map((pt) => pt.technique_id) ?? []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neuro-50/50 to-white">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full bg-white border-b border-neuro-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/images/marca.webp" alt="Neurowork" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neuro-500">{user.email}</span>
            <form action={signout}>
              <Button
                variant="ghost"
                size="sm"
                className="text-neuro-500 hover:text-neuro-700 hover:bg-neuro-50"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-28 pb-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="animate-slide-up text-2xl font-bold text-neuro-900">
            Painel do Profissional
          </h1>
          <p className="animate-slide-up delay-100 mt-1 text-neuro-500">
            Gerencie seu perfil e suas técnicas
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="animate-slide-up delay-200 lg:col-span-2">
            <div className="rounded-2xl border border-neuro-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-neuro-900">
                  <User className="h-4 w-4 text-neuro-500" />
                  Meu Perfil
                </h2>
                <Link href="/dashboard/perfil">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-neuro-200 text-neuro-600 hover:bg-neuro-50"
                  >
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    Editar
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col items-start gap-6 sm:flex-row">
                {/* Avatar placeholder */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-neuro-200 bg-neuro-50 text-neuro-300 transition-colors hover:border-neuro-300 hover:text-neuro-400 cursor-pointer">
                  <Camera className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm text-neuro-400">Nome</p>
                    <p className="font-medium text-neuro-800">
                      {profile?.nome || (
                        <span className="text-neuro-300 italic">
                          Não preenchido
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neuro-400">Bio</p>
                    <p className="text-sm text-neuro-600">
                      {profile?.bio || (
                        <span className="text-neuro-300 italic">
                          Adicione uma descrição sobre você
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-neuro-400">Estado</p>
                      <p className="text-sm font-medium text-neuro-700">
                        {profile?.estado || (
                          <span className="text-neuro-300">—</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neuro-400">Cidade</p>
                      <p className="text-sm font-medium text-neuro-700">
                        {profile?.cidade || (
                          <span className="text-neuro-300">—</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-neuro-50 pt-5">
                {[
                  { icon: AtSign, label: "Instagram", value: profile?.instagram },
                  { icon: Globe, label: "Facebook", value: profile?.facebook },
                  { icon: Video, label: "YouTube", value: profile?.youtube },
                  { icon: Link2, label: "LinkedIn", value: profile?.linkedin },
                  { icon: Mail, label: "Email", value: profile?.email_contato },
                ].map((social) => (
                  <div
                    key={social.label}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      social.value
                        ? "border-neuro-200 bg-neuro-50 text-neuro-700"
                        : "border-neuro-100 bg-neuro-50/50 text-neuro-300"
                    }`}
                  >
                    <social.icon className="h-3.5 w-3.5" />
                    {social.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Techniques Card */}
          <div className="animate-slide-up delay-300">
            <div className="rounded-2xl border border-neuro-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-neuro-900">
                <Zap className="h-4 w-4 text-neuro-500" />
                Técnicas
              </h2>

              <div className="space-y-2">
                {techniques?.map((tech) => {
                  const isSelected = selectedTechIds.has(tech.id);
                  return (
                    <div
                      key={tech.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-sm transition-all cursor-pointer ${
                        isSelected
                          ? "border-neuro-300 bg-gradient-to-r from-neuro-50 to-neuro-100/50 text-neuro-800 shadow-sm"
                          : "border-neuro-100 text-neuro-400 hover:border-neuro-200 hover:text-neuro-600"
                      }`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isSelected ? "bg-neuro-500" : "bg-neuro-200"
                        }`}
                      />
                      <span className="font-medium leading-tight">
                        {tech.nome}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-neuro-400">
                Em breve: selecione suas técnicas clicando nelas.
              </p>
            </div>
          </div>

          {/* Admin link (if admin) */}
          {profile?.role === "admin" && (
            <div className="animate-slide-up delay-350 lg:col-span-3">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-2xl border border-neuro-200 bg-gradient-to-r from-neuro-50 to-neuro-100/50 p-4 text-sm font-medium text-neuro-700 transition-all hover:border-neuro-300 hover:shadow-md"
              >
                <Settings className="h-5 w-5 text-neuro-500" />
                Acessar Painel Administrativo
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          <div className="animate-slide-up delay-400 lg:col-span-3">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: User,
                  label: "Perfil",
                  value: profile?.nome ? "Completo" : "Incompleto",
                  color: profile?.nome
                    ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                    : "text-amber-600 bg-amber-50 border-amber-100",
                },
                {
                  icon: MapPin,
                  label: "Localização",
                  value: profile?.estado
                    ? `${profile.cidade || "—"}, ${profile.estado}`
                    : "Não definida",
                  color: profile?.estado
                    ? "text-neuro-600 bg-neuro-50 border-neuro-100"
                    : "text-amber-600 bg-amber-50 border-amber-100",
                },
                {
                  icon: Zap,
                  label: "Técnicas",
                  value: `${selectedTechIds.size} selecionada(s)`,
                  color:
                    selectedTechIds.size > 0
                      ? "text-neuro-600 bg-neuro-50 border-neuro-100"
                      : "text-amber-600 bg-amber-50 border-amber-100",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`flex items-center gap-3 rounded-xl border p-4 ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                  <div>
                    <p className="text-xs font-medium opacity-70">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
