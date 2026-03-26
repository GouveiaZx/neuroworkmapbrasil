import Link from "next/link";
import { MapPin, Search, Users, Zap, Shield, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-neuro-200 shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/images/marca.webp"
            alt="Neurowork"
            className="h-8"
          />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/profissionais">
            <Button
              variant="ghost"
              size="sm"
              className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100"
            >
              Profissionais
            </Button>
          </Link>
          <Link href="/mapa">
            <Button
              variant="ghost"
              size="sm"
              className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100"
            >
              Mapa
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-neuro-700 hover:text-neuro-900 hover:bg-neuro-100"
            >
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 min-h-screen flex items-center">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/images/video-home.webm" type="video/webm" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C4E2A]/80 via-[#16530C]/70 to-[#072318]/90" />

      {/* Subtle animated elements */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl animate-pulse-soft delay-300" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
        {/* Tag pill */}
        <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/90 shadow-lg backdrop-blur-md">
          <Zap className="h-3.5 w-3.5 text-gold-400" />
          Plataforma de Neurofeedback do Brasil
        </div>

        {/* Heading */}
        <h1 className="heading-display animate-slide-up delay-100 mb-6 max-w-4xl text-5xl leading-[1.08] text-white sm:text-6xl lg:text-7xl drop-shadow-lg">
          Encontre{" "}
          <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
            profissionais
          </span>{" "}
          de neurofeedback
        </h1>

        {/* Subtitle */}
        <p className="animate-slide-up delay-200 mb-12 max-w-xl text-lg leading-relaxed text-white/80">
          Explore por estado, técnica ou cidade. Conecte-se com especialistas
          qualificados em todo o Brasil.
        </p>

        {/* CTA */}
        <div className="animate-slide-up delay-300">
          <Link href="/mapa">
            <Button
              size="lg"
              className="h-14 rounded-lg px-12 text-base font-semibold uppercase tracking-wide bg-gradient-to-r from-gold-500 to-gold-600 text-white gold-glow hover:from-gold-600 hover:to-gold-700 transition-all duration-300"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Buscar profissionais
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-slide-up delay-500 mt-20 grid grid-cols-3 gap-8 sm:gap-20">
          {[
            { value: "6", label: "Técnicas" },
            { value: "27", label: "Estados" },
            { value: "100%", label: "Gratuito" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="heading-display text-3xl text-gold-400 sm:text-4xl drop-shadow-md">
                {stat.value}
              </div>
              <div className="mt-1.5 text-sm font-medium text-white/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Mapa Interativo",
      description:
        "Navegue pelo mapa do Brasil e encontre profissionais no seu estado com filtros avançados.",
    },
    {
      icon: Users,
      title: "Perfis Completos",
      description:
        "Cada profissional tem um perfil detalhado com bio, foto, localização e redes sociais.",
    },
    {
      icon: Zap,
      title: "Técnicas Especializadas",
      description:
        "Filtre por neurofeedback, biofeedback, fotobioestimulação e outras técnicas avançadas.",
    },
    {
      icon: Shield,
      title: "Verificado",
      description:
        "Perfis moderados para garantir a qualidade e confiabilidade dos profissionais cadastrados.",
    },
  ];

  return (
    <section className="relative border-t border-neuro-100 bg-white py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="heading-display animate-slide-up mb-4 text-3xl text-neuro-900 sm:text-4xl">
            Por que Neurowork?
          </h2>
          <p className="animate-slide-up delay-100 mx-auto max-w-lg text-neuro-600/70">
            A plataforma mais completa para conectar profissionais de
            neurofeedback com quem precisa.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`animate-scale-in delay-${(i + 1) * 100} card-premium group rounded-2xl border border-neuro-100 bg-gradient-to-b from-white to-neuro-50/50 p-6`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neuro-100 to-neuro-200/50 text-neuro-600 transition-all duration-300 group-hover:from-gold-500 group-hover:to-gold-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-gold-500/25">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-neuro-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-neuro-600/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechniquesSection() {
  const techniques = [
    { name: "Neurofeedback", color: "from-green-600 to-green-700" },
    { name: "Biofeedback", color: "from-emerald-500 to-emerald-600" },
    { name: "Fotobioestimulação", color: "from-amber-500 to-amber-600" },
    {
      name: "Estimulação Transcraniana",
      color: "from-lime-600 to-lime-700",
    },
    { name: "Realidade Virtual", color: "from-teal-500 to-teal-600" },
    {
      name: "Estimulação do Nervo Vago",
      color: "from-yellow-600 to-yellow-700",
    },
  ];

  return (
    <section className="neural-bg border-t border-neuro-100 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="heading-display mb-4 text-3xl text-neuro-900 sm:text-4xl">
            Técnicas Disponíveis
          </h2>
          <p className="mx-auto max-w-lg text-neuro-600/70">
            Profissionais especializados nas mais avançadas técnicas de
            neuromodulação e neurofeedback.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techniques.map((tech, i) => (
            <div
              key={tech.name}
              className={`animate-slide-up delay-${(i + 1) * 100} card-premium group flex items-center gap-4 rounded-2xl border border-neuro-100 bg-white/80 p-5 backdrop-blur-sm`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tech.color} shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-neuro-800">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-neuro-100 bg-gradient-to-br from-neuro-700 via-neuro-800 to-neuro-900 py-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-neuro-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="mb-6 flex justify-center">
          <img src="/images/marca.webp" alt="Neurowork" className="h-8" />
        </div>
        <h2 className="heading-display mb-4 text-2xl text-white sm:text-3xl">
          Tecnologias aplicadas à saúde e educação
        </h2>
        <p className="text-neuro-200/70">
          Referência em neurociência aplicada no Brasil.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neuro-100 bg-white py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="shrink-0">
          <img
            src="/images/marca.webp"
            alt="Neurowork"
            className="h-8"
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/profissionais"
            className="text-sm font-medium text-neuro-600 hover:text-neuro-900 transition-colors"
          >
            Profissionais
          </Link>
          <Link
            href="/mapa"
            className="text-sm font-medium text-neuro-600 hover:text-neuro-900 transition-colors"
          >
            Mapa
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-neuro-600 hover:text-neuro-900 transition-colors"
          >
            Entrar
          </Link>
        </div>

        <p className="text-xs text-neuro-400">
          &copy; {new Date().getFullYear()} Neurowork. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TechniquesSection />
      <CTASection />
      <Footer />
    </>
  );
}
