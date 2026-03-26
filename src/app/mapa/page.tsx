"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MapPin, Brain, Mail, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import BrazilMap, { getStateName } from "@/components/brazil-map";

interface ProfileWithTechniques {
  id: string;
  nome: string;
  bio: string | null;
  foto_url: string | null;
  estado: string | null;
  cidade: string | null;
  email_contato: string | null;
  profile_techniques: { techniques: { id: string; nome: string } | null }[];
}

export default function MapaPage() {
  const supabase = createClient();
  const [stateCounts, setStateCounts] = useState<Record<string, number>>({});
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileWithTechniques[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [totalProfessionals, setTotalProfessionals] = useState(0);

  // Load state counts on mount
  useEffect(() => {
    async function loadCounts() {
      const { data } = await supabase
        .from("profiles")
        .select("estado")
        .not("nome", "is", null)
        .not("estado", "is", null);

      const counts: Record<string, number> = {};
      data?.forEach((p) => {
        if (p.estado) counts[p.estado] = (counts[p.estado] || 0) + 1;
      });
      setStateCounts(counts);
      setTotalProfessionals(data?.length ?? 0);
    }
    loadCounts();
  }, [supabase]);

  // Load profiles when state is selected
  const loadProfiles = useCallback(
    async (estado: string) => {
      setLoadingProfiles(true);
      const { data } = await supabase
        .from("profiles")
        .select("*, profile_techniques(techniques(id, nome))")
        .eq("estado", estado)
        .not("nome", "is", null)
        .order("nome");
      setProfiles((data as ProfileWithTechniques[]) ?? []);
      setLoadingProfiles(false);
    },
    [supabase]
  );

  function handleStateSelect(stateId: string | null) {
    setSelectedState(stateId);
    if (stateId) {
      loadProfiles(stateId);
    } else {
      setProfiles([]);
    }
  }

  const statesWithProfs = Object.keys(stateCounts).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neuro-50/50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-neuro-200 shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/images/marca.webp" alt="Neurowork" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/profissionais">
              <Button variant="ghost" size="sm" className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100">
                Profissionais
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 pt-28 pb-16">
        <div className="mb-10 text-center">
          <h1 className="heading-display animate-slide-up text-3xl font-bold text-neuro-900 sm:text-4xl">
            Mapa de Profissionais
          </h1>
          <p className="animate-slide-up delay-100 mt-2 text-neuro-500">
            Clique em um estado para ver os profissionais da região
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: Map + Stats */}
          <div className="space-y-4">
            <div className="animate-scale-in delay-200 rounded-2xl border border-neuro-100 bg-white p-6">
              <BrazilMap
                stateCounts={stateCounts}
                selectedState={selectedState}
                onStateSelect={handleStateSelect}
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-neuro-100 bg-white p-4">
                <p className="text-xs text-neuro-500">Total de profissionais</p>
                <p className="text-2xl font-bold text-neuro-800">
                  {totalProfessionals}
                </p>
              </div>
              <div className="rounded-xl border border-neuro-100 bg-white p-4">
                <p className="text-xs text-neuro-500">Estados cobertos</p>
                <p className="text-2xl font-bold text-neuro-800">
                  {statesWithProfs}
                  <span className="text-sm font-normal text-neuro-400">
                    /27
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Profiles panel */}
          <div className="animate-slide-up delay-300">
            {!selectedState ? (
              /* No state selected — show states list */
              <div className="rounded-2xl border border-neuro-100 bg-white p-6">
                <h3 className="mb-4 font-semibold text-neuro-900">
                  Selecione um estado
                </h3>
                <p className="mb-4 text-sm text-neuro-500">
                  Clique no mapa ou escolha abaixo:
                </p>
                {Object.keys(stateCounts).length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {Object.entries(stateCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([estado, count]) => (
                        <button
                          key={estado}
                          onClick={() => handleStateSelect(estado)}
                          className="flex w-full items-center justify-between rounded-xl border border-neuro-100 p-3 text-sm transition-all hover:border-neuro-300 hover:bg-neuro-50"
                        >
                          <span className="flex items-center gap-2 font-medium text-neuro-700">
                            <MapPin className="h-3.5 w-3.5 text-neuro-400" />
                            {getStateName(estado)} ({estado})
                          </span>
                          <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                            {count}
                          </span>
                        </button>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-neuro-400">
                    Nenhum profissional cadastrado ainda.
                  </p>
                )}

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-neuro-100">
                  <p className="mb-2 text-xs font-semibold text-neuro-400 uppercase tracking-wider">
                    Legenda
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ background: "#3da03d" }}
                      />
                      <span className="text-xs text-neuro-500">
                        Com profissionais
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ background: "#e8f5ea" }}
                      />
                      <span className="text-xs text-neuro-500">
                        Sem profissionais
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ background: "#16530C" }}
                      />
                      <span className="text-xs text-neuro-500">
                        Selecionado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* State selected — show profiles */
              <div className="rounded-2xl border border-neuro-100 bg-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neuro-100 bg-neuro-50/50 px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-neuro-900">
                      {getStateName(selectedState)}
                    </h3>
                    <p className="text-xs text-neuro-500">
                      {profiles.length} profissional(is)
                    </p>
                  </div>
                  <button
                    onClick={() => handleStateSelect(null)}
                    className="rounded-lg border border-neuro-200 bg-white p-1.5 text-neuro-400 hover:text-neuro-700 hover:border-neuro-300 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Profiles list */}
                <div className="max-h-[550px] overflow-y-auto divide-y divide-neuro-50">
                  {loadingProfiles ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-6 w-6 animate-spin text-neuro-400" />
                    </div>
                  ) : profiles.length === 0 ? (
                    <div className="py-16 text-center">
                      <Brain className="mx-auto mb-3 h-10 w-10 text-neuro-200" />
                      <p className="text-sm font-medium text-neuro-600">
                        Nenhum profissional neste estado
                      </p>
                      <p className="mt-1 text-xs text-neuro-400">
                        Tente selecionar outro estado no mapa
                      </p>
                    </div>
                  ) : (
                    profiles.map((profile) => (
                      <Link
                        key={profile.id}
                        href={`/profissionais/${profile.id}`}
                        className="flex gap-4 p-4 hover:bg-neuro-50/50 transition-colors group"
                      >
                        {/* Avatar */}
                        {profile.foto_url ? (
                          <img
                            src={profile.foto_url}
                            alt={profile.nome}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-neuro-100"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neuro-50 text-neuro-300">
                            <Brain className="h-5 w-5" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-neuro-900 truncate group-hover:text-neuro-600 transition-colors">
                            {profile.nome}
                          </h4>
                          {profile.cidade && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-neuro-400">
                              <MapPin className="h-3 w-3" />
                              {profile.cidade}, {profile.estado}
                            </p>
                          )}
                          {profile.bio && (
                            <p className="mt-1 text-xs text-neuro-500 line-clamp-2 leading-relaxed">
                              {profile.bio}
                            </p>
                          )}
                          {profile.profile_techniques?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {profile.profile_techniques
                                .slice(0, 3)
                                .map((pt) =>
                                  pt.techniques ? (
                                    <span
                                      key={pt.techniques.id}
                                      className="rounded-full border border-neuro-200 bg-neuro-50 px-2 py-0.5 text-[10px] font-medium text-neuro-600"
                                    >
                                      {pt.techniques.nome}
                                    </span>
                                  ) : null
                                )}
                              {profile.profile_techniques.length > 3 && (
                                <span className="text-[10px] text-neuro-400 self-center">
                                  +{profile.profile_techniques.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
