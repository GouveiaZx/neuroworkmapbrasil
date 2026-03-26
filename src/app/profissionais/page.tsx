import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Brain, MapPin, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProfissionaisPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tecnica?: string; busca?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Fetch techniques for filter
  const { data: techniques } = await supabase
    .from("techniques")
    .select("*")
    .order("nome");

  // Build query
  let query = supabase
    .from("profiles")
    .select("*, profile_techniques(technique_id, techniques(id, nome))")
    .not("nome", "is", null);

  if (params.estado) {
    query = query.eq("estado", params.estado);
  }
  if (params.busca) {
    query = query.or(
      `nome.ilike.%${params.busca}%,cidade.ilike.%${params.busca}%`
    );
  }

  const { data: profiles } = await query.order("nome");

  // Filter by technique client-side (supabase join filter is complex)
  let filteredProfiles = profiles ?? [];
  if (params.tecnica) {
    filteredProfiles = filteredProfiles.filter((p: any) =>
      p.profile_techniques?.some(
        (pt: any) => pt.techniques?.id === params.tecnica
      )
    );
  }

  const ESTADOS_BR = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neuro-50/50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-neuro-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/images/marca.webp" alt="Neurowork" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/mapa">
              <Button variant="ghost" size="sm" className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100">Mapa</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button className="h-10 px-6 text-sm font-semibold rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white gold-glow hover:from-gold-600 hover:to-gold-700 transition-all duration-300 uppercase tracking-wide">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neuro-500 hover:text-neuro-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>
          <h1 className="animate-slide-up text-3xl font-bold text-neuro-900">
            Profissionais
            {params.estado && <span className="text-neuro-500"> — {params.estado}</span>}
          </h1>
          <p className="animate-slide-up delay-100 mt-2 text-neuro-500">
            {filteredProfiles.length} profissional(is) encontrado(s)
          </p>
        </div>

        {/* Filters */}
        <div className="animate-slide-up delay-200 mb-8 rounded-2xl border border-neuro-100 bg-white p-5">
          <form className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neuro-300" />
              <input
                name="busca"
                defaultValue={params.busca ?? ""}
                placeholder="Buscar por nome ou cidade..."
                className="h-11 w-full rounded-xl border border-neuro-200 bg-white pl-10 pr-4 text-sm placeholder:text-neuro-300 focus:border-neuro-400 focus:outline-none focus:ring-2 focus:ring-neuro-400/20"
              />
            </div>
            <select
              name="estado"
              defaultValue={params.estado ?? ""}
              className="h-11 rounded-xl border border-neuro-200 bg-white px-3 text-sm text-neuro-700 focus:border-neuro-400 focus:outline-none focus:ring-2 focus:ring-neuro-400/20"
            >
              <option value="">Todos os estados</option>
              {ESTADOS_BR.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            <select
              name="tecnica"
              defaultValue={params.tecnica ?? ""}
              className="h-11 rounded-xl border border-neuro-200 bg-white px-3 text-sm text-neuro-700 focus:border-neuro-400 focus:outline-none focus:ring-2 focus:ring-neuro-400/20"
            >
              <option value="">Todas as técnicas</option>
              {techniques?.map((t) => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
            <Button type="submit" className="h-11 rounded-xl bg-gradient-to-r from-neuro-500 to-neuro-600 text-white">
              <Search className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </form>
        </div>

        {/* Results */}
        {filteredProfiles.length === 0 ? (
          <div className="rounded-2xl border border-neuro-100 bg-white p-16 text-center">
            <Brain className="mx-auto mb-4 h-12 w-12 text-neuro-200" />
            <h3 className="mb-2 text-lg font-semibold text-neuro-700">Nenhum profissional encontrado</h3>
            <p className="text-sm text-neuro-400">Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProfiles.map((profile: any, i: number) => (
              <Link
                key={profile.id}
                href={`/profissionais/${profile.id}`}
                className={`animate-scale-in delay-${Math.min(i + 1, 5) * 100} group rounded-2xl border border-neuro-100 bg-white p-5 transition-all duration-300 hover:border-neuro-200 hover:shadow-lg hover:shadow-neuro-200/30 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  {profile.foto_url ? (
                    <img
                      src={profile.foto_url}
                      alt={profile.nome}
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-neuro-100"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neuro-100 to-neuro-200/50 text-neuro-400">
                      <Brain className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-neuro-900 truncate group-hover:text-neuro-600 transition-colors">
                      {profile.nome}
                    </h3>
                    {(profile.cidade || profile.estado) && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-neuro-400">
                        <MapPin className="h-3 w-3" />
                        {[profile.cidade, profile.estado].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {profile.bio && (
                  <p className="mt-3 text-sm text-neuro-500 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {profile.profile_techniques?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {profile.profile_techniques.slice(0, 3).map((pt: any) => (
                      <span
                        key={pt.technique_id}
                        className="inline-flex rounded-full border border-neuro-200 bg-neuro-50 px-2.5 py-0.5 text-[11px] font-medium text-neuro-600"
                      >
                        {pt.techniques?.nome}
                      </span>
                    ))}
                    {profile.profile_techniques.length > 3 && (
                      <span className="text-[11px] text-neuro-400 self-center">
                        +{profile.profile_techniques.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
