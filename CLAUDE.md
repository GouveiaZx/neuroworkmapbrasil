@AGENTS.md

# Neurowork

## Visão Geral

Sistema web para promoção de profissionais de neurofeedback no Brasil.
Perfis públicos, mapa interativo do Brasil por estado e painel administrativo.

Referências visuais:
- https://neurofeedbackbrasil.com.br
- https://neurowork.com.br

## Stack

- **Frontend:** Next.js 14+, Tailwind CSS, ShadCN UI
- **Backend/Auth/DB:** Supabase (Auth, PostgreSQL, Storage)
- **Deploy:** Vercel (front) + Supabase (backend)

## Estrutura do Banco (Supabase)

### users
- id, email, role (admin/user)

### profiles
- id, user_id, nome, bio, foto_url
- estado, cidade
- instagram, facebook, youtube, linkedin, email_contato

### techniques
- id, nome

### profile_techniques
- id, profile_id, technique_id

### Técnicas pré-cadastradas
- FOTOBIOESTIMULAÇÃO
- NEUROFEEDBACK
- BIOFEEDBACK
- ESTIMULAÇÃO TRANSCRANIANA POR CORRENTE CONTÍNUA
- REALIDADE VIRTUAL
- ESTIMULAÇÃO DO NERVO VAGO

## Funcionalidades

- Cadastro/login de profissionais (email + senha via Supabase Auth)
- Perfil público com foto, bio, localização, redes sociais e técnicas (badges)
- Mapa interativo do Brasil clicável por estado → lista profissionais com filtro por técnica/cidade
- Busca por nome, cidade ou técnica
- Painel admin: gerenciar usuários, técnicas, moderar perfis, estatísticas
- Roles: ADMIN e USER

## Fases de Desenvolvimento

1. **Base** — Setup Next.js + Supabase, auth, estrutura DB
2. **Perfis** — CRUD completo, upload foto, técnicas selecionáveis
3. **Front público** — Listagem de profissionais, página de perfil
4. **Mapa** — Mapa interativo Brasil, filtro por estado
5. **Admin** — Painel completo, gestão de técnicas
6. **Polimento** — UI moderna, responsividade, SEO

## Convenções

- Código em inglês (variáveis, funções, componentes)
- Textos da UI em português (pt-BR)
- Componentes React com PascalCase
- Arquivos com kebab-case
- Usar ShadCN UI como base de componentes
- Paleta: branco, azul claro, gradientes suaves
- Estilo: cards modernos, sombras leves, bordas arredondadas

## MCPs Disponíveis

- **sequential-thinking** — raciocínio estruturado para decisões complexas
- **memory** — contexto persistente entre sessões
- **context7** — docs atualizadas de libs (Next.js, Supabase, Tailwind)
- **chrome-devtools** — debug de UI no navegador
- **supabase** — (a configurar) interação direta com Supabase
