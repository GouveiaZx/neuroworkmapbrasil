"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function CadastroPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const benefits = [
    "Perfil público profissional",
    "Apareça no mapa interativo",
    "Destaque suas técnicas",
    "Conecte-se com pacientes",
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#16530C] via-[#0C4E2A] to-[#072318]">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/3 right-1/5 h-56 w-56 rounded-full bg-white/5 blur-3xl animate-pulse-soft delay-300" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <img
            src="/images/marca.webp"
            alt="Neurowork"
            className="h-10 mb-12 w-fit"
          />
          <h2 className="heading-display mb-4 text-4xl leading-tight text-white">
            Junte-se ao<br />Neurowork
          </h2>
          <p className="mb-8 max-w-sm text-lg text-white/70 leading-relaxed">
            Crie seu perfil gratuitamente e seja encontrado por pacientes em todo o Brasil.
          </p>

          <div className="space-y-3">
            {benefits.map((benefit, i) => (
              <div
                key={benefit}
                className={`animate-slide-up delay-${(i + 2) * 100} flex items-center gap-3`}
              >
                <CheckCircle className="h-5 w-5 text-gold-400" />
                <span className="text-sm font-medium text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 bg-gradient-to-b from-white to-neuro-50/30">
        <div className="w-full max-w-sm">
          {/* Back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-neuro-500 hover:text-neuro-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>

          {/* Logo mobile */}
          <div className="mb-8 sm:hidden">
            <img
              src="/images/marca.webp"
              alt="Neurowork"
              className="h-7"
            />
          </div>

          <h1 className="heading-display animate-slide-up mb-2 text-2xl text-neuro-900">
            Criar conta
          </h1>
          <p className="animate-slide-up delay-100 mb-8 text-sm text-neuro-500">
            Cadastre-se para criar seu perfil profissional
          </p>

          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="animate-scale-in rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="animate-slide-up delay-200 space-y-2">
              <Label htmlFor="email" className="text-neuro-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="h-12 rounded-lg border-neuro-200 bg-white/80 placeholder:text-neuro-300 focus:border-neuro-400 focus:ring-neuro-400/20"
              />
            </div>

            <div className="animate-slide-up delay-300 space-y-2">
              <Label htmlFor="password" className="text-neuro-700 font-medium">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                className="h-12 rounded-lg border-neuro-200 bg-white/80 placeholder:text-neuro-300 focus:border-neuro-400 focus:ring-neuro-400/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="animate-slide-up delay-400 h-12 w-full rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white gold-glow hover:from-gold-600 hover:to-gold-700 transition-all duration-300"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="animate-slide-up delay-500 mt-6 text-center text-sm text-neuro-500">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium text-gold-600 hover:text-gold-700 transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
