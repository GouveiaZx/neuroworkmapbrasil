import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Brain,
  MapPin,
  ArrowLeft,
  AtSign,
  Globe,
  Video,
  Link2,
  Mail,
  ExternalLink,
} from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile || !profile.nome) notFound();

  const { data: profileTechniques } = await supabase
    .from("profile_techniques")
    .select("techniques(id, nome)")
    .eq("profile_id", id);

  const techs = profileTechniques?.map((pt: any) => pt.techniques).filter(Boolean) ?? [];

  const socialLinks = [
    { icon: AtSign, label: "Instagram", value: profile.instagram, prefix: "https://instagram.com/" },
    { icon: Globe, label: "Facebook", value: profile.facebook, prefix: "" },
    { icon: Video, label: "YouTube", value: profile.youtube, prefix: "" },
    { icon: Link2, label: "LinkedIn", value: profile.linkedin, prefix: "" },
  ].filter((s) => s.value);

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

      <main className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <Link
          href="/profissionais"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-neuro-500 hover:text-neuro-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para profissionais
        </Link>

        {/* Profile card */}
        <div className="animate-slide-up rounded-2xl border border-neuro-100 bg-white shadow-sm">
          {/* Banner */}
          <div className="h-36 rounded-t-2xl bg-gradient-to-r from-neuro-500 via-neuro-600 to-neuro-700 relative">
            <div className="absolute inset-0 rounded-t-2xl bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
          </div>

          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-14 mb-4">
              {profile.foto_url ? (
                <img
                  src={profile.foto_url}
                  alt={profile.nome}
                  className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg bg-white"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-neuro-100 to-neuro-200 text-neuro-400 shadow-lg">
                  <Brain className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Name & Location */}
            <h1 className="text-2xl font-bold text-neuro-900">{profile.nome}</h1>
            {(profile.cidade || profile.estado) && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-neuro-500">
                <MapPin className="h-4 w-4" />
                {[profile.cidade, profile.estado].filter(Boolean).join(", ")}
              </p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-neuro-600 border-t border-neuro-50 pt-4">
                {profile.bio}
              </p>
            )}

            {/* Techniques */}
            {techs.length > 0 && (
              <div className="mt-5 border-t border-neuro-50 pt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neuro-400">
                  Técnicas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech: any) => (
                    <span
                      key={tech.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-neuro-200 bg-gradient-to-r from-neuro-50 to-neuro-100/50 px-3.5 py-1.5 text-xs font-medium text-neuro-700"
                    >
                      <Brain className="h-3 w-3" />
                      {tech.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            {(socialLinks.length > 0 || profile.email_contato) && (
              <div className="mt-5 border-t border-neuro-50 pt-5">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neuro-400">
                  Contato & Redes Sociais
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.email_contato && (
                    <a
                      href={`mailto:${profile.email_contato}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-neuro-200 bg-white px-4 py-2.5 text-sm font-medium text-neuro-700 transition-all hover:border-neuro-300 hover:bg-neuro-50 hover:shadow-sm"
                    >
                      <Mail className="h-4 w-4 text-neuro-500" />
                      Enviar mensagem
                    </a>
                  )}
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.value!.startsWith("http") ? social.value! : `${social.prefix}${social.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-neuro-200 bg-white px-4 py-2.5 text-sm font-medium text-neuro-700 transition-all hover:border-neuro-300 hover:bg-neuro-50 hover:shadow-sm"
                    >
                      <social.icon className="h-4 w-4 text-neuro-500" />
                      {social.label}
                      <ExternalLink className="h-3 w-3 text-neuro-300" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
