📌 Visão Geral

Sistema web moderno para promoção de profissionais da área de neurofeedback, com perfis públicos, mapa interativo do Brasil e painel administrativo completo.

Baseado nas referências:

https://neurofeedbackbrasil.com.br
https://neurowork.com.br

Objetivo: criar uma versão mais moderna, rápida e escalável, com UX atual e fácil manutenção.

🎯 Funcionalidades Principais
👤 Cadastro e Perfis
Cadastro de usuários (profissionais)
Login (email + senha)
Edição de perfil
📄 Perfil público deve conter:
Nome
Foto
Descrição
Localização (estado/cidade)
Contatos:
Instagram
Facebook
YouTube
LinkedIn
Email (botão "Mensagem")
Lista de técnicas (selecionáveis):
FOTOBIOESTIMULAÇÃO
NEUROFEEDBACK
BIOFEEDBACK
ESTIMULAÇÃO TRANSCраниANA POR CORRENTE CONTÍNUA
REALIDADE VIRTUAL
ESTIMULAÇÃO DO NERVO VAGO

✔ Essas técnicas devem aparecer no perfil como badges/tags visuais

✔ O admin pode:

Criar novas técnicas
Editar
Remover
🗺️ Mapa Interativo (Diferencial)
Mapa do Brasil clicável por estado
Ao clicar:
Lista profissionais daquele estado
Filtro adicional:
Por técnica
Por cidade
🔎 Busca e Filtros
Buscar por:
Nome
Cidade
Técnica
🔐 Painel Administrativo

Admin deve conseguir:

Gerenciar usuários
Editar
Excluir
Gerenciar técnicas
Moderar perfis
Ver estatísticas básicas

✔ Sistema de roles:

ADMIN
USER
📝 Cadastro público
Página tipo:
/cadastro
Usuário cria conta e já monta perfil
🧠 UX/UI (Muito importante)

Direção visual:

Base no estilo da neurowork (clean + moderno)
Paleta:
Branco
Azul claro
Gradientes suaves
Componentes:
Cards modernos
Sombras leves
Bordas arredondadas
⚙️ Stack Tecnológica
Frontend
Next.js 14+
Tailwind CSS
ShadCN UI
Backend / Auth / DB
Supabase
Auth
PostgreSQL
Storage (fotos)
Deploy
Front: Vercel
Backend: Supabase
🧩 Estrutura do Banco (Supabase)
Tabela: users
id
email
role (admin/user)
Tabela: profiles
id
user_id
nome
bio
foto_url
estado
cidade
instagram
facebook
youtube
linkedin
email_contato
Tabela: techniques
id
nome
Tabela: profile_techniques
id
profile_id
technique_id
🔌 MCPs a utilizar (Claude Code)
Obrigatórios
sequential-thinking (fluxo estruturado)
memory (contexto do projeto)
supabase MCP
Extras importantes
chrome-devtools MCP → debug UI
context7 → docs e libs
🚀 Etapas de Desenvolvimento
Fase 1 — Base
Setup Next + Supabase
Auth funcionando
Estrutura DB
Fase 2 — Perfis
CRUD completo
Upload de foto
Técnicas selecionáveis
Fase 3 — Front público
Listagem de profissionais
Página de perfil
Fase 4 — Mapa
Mapa interativo Brasil
Filtro por estado
Fase 5 — Admin
Painel completo
Gestão de técnicas
Fase 6 — Polimento
UI moderna
Responsividade
SEO básico
💰 Estimativa (pra você mandar pro cliente)

💵 Valor ideal:
👉 R$ 4.500 a R$ 6.000

💵 Valor pra fechar rápido:
👉 R$ 3.500 – R$ 4.200

⏱️ Prazo:
👉 15 a 25 dias

💡 Observações Estratégicas
Começar do zero foi a melhor decisão (evita lixo técnico)
Supabase resolve tudo rápido (auth + db + storage)
Mapa é o diferencial que dá valor no projeto
Sistema já nasce como base pra SaaS futuramente