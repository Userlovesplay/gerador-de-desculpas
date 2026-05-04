# 🎭 Gerador de Desculpas Profissionais

> O ghostwriter discreto das suas desculpas profissionais.

Um gerador inteligente de desculpas corporativas, com 3 variações por situação, ajustadas por tom, formalidade e canal de comunicação.

![Vite](https://img.shields.io/badge/Vite-7.3.2-646CFF?style=flat-square)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.14-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Funcionalidades

- **3 Variações instantâneas** — Cada geração traz três opções com níveis diferentes de risco
- **6 tons de comunicação** — Diplomático, Sincero, Espirituoso, Dramático, Técnico, Vago
- **4 níveis de formalidade** — Casual, Neutro, Formal, Executivo
- **5 canais otimizados** — E-mail, Slack, WhatsApp, Presencial, Reunião
- **Histórico persistente** — Suas últimas 5 gerações salvas no localStorage
- **Modo Demo** — Funciona sem backend usando dados simulados
- **Design editorial** — Tipografia serifada, animações suaves, scrollbar personalizada
- **🌐 Dois idiomas** — Português (pt-BR) e Inglês (en) com troca instantânea
- **🎨 Tema claro/escuro** — Suporte a light mode, dark mode e system preference

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|--------------|
| **Build** | Vite 7 + TypeScript 5 |
| **UI** | React 19 + Tailwind CSS 4 |
| **Componentes** | Radix UI + shadcn/ui |
| **Animações** | CSS Animations |
| **Estado** | TanStack React Query |
| **Roteamento** | Wouter |
| **i18n** | Context API customizado |
| **Tema** | next-themes |
| **Deploy** | Pronto para Vercel / Netlify |

---

## 🚀 Como rodar

```bash
# Instale as dependências
npm install

# Rode o servidor de desenvolvimento

npm run dev
```

Acesse: `http://localhost:3000`

---

## ⚙️ Configuração da API Groq

### 1. Obtenha uma API Key do Groq

1. Acesse [console.groq.com/keys](https://console.groq.com/keys)
2. Crie uma conta ou faça login
3. Gere uma nova API key
4. Copie a chave

### 2. Configure as variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`
	```bash
	cp .env.example .env
	```

2. Cole sua API key no arquivo `.env`:
	```env
	VITE_GROQ_API_KEY=sua_chave_aqui
	VITE_GROQ_MODEL=mixtral-8x7b-32768
	```

3. Modelos disponíveis (todos gratuitos):
	- `mixtral-8x7b-32768` (padrão - melhor qualidade)
	- `llama2-70b-4096` (mais rápido)
	- `gemma-7b-it` (menor)

### 3. Teste a API

- Inicie o servidor: `npm run dev`
- Preencha o formulário e clique em "Gerar três versões"
- A aplicação usará a API Groq se configurada, ou fallback para dados demo
---

## 📦 Build para produção

```bash
npm run build
npm run serve
```

---

## 🎨 Idiomas e Temas

### 🌐 Dois idiomas
- **Português (pt-BR)** — Idioma padrão
- **English (en)** — Instant switch via header button
- Persistência no localStorage

### 🎨 Tema claro/escuro
- **Light Mode** — Fundo claro com texto escuro
- **Dark Mode** — Fundo escuro com texto claro  
- **System** — Segue a preferência do sistema operacional
- Persistência no localStorage

---

## 🎨 Design System

- **Tipografia**: Playfair Display (serif) + Space Mono (mono) + Plus Jakarta Sans (sans)
- **Cores**: Tema escuro/claro com fundo degradê e texto alto contraste (WCAG AA)
- **Cursor**: Personalizado com crosshair sutil
- **Scrollbar**: Fina (8px) com cor semi-transparente
- **Animações**: Fade + slide suaves nas entradas de texto

---

## 📝 Licença

MIT © 2026 — [Guilherme Oliveira](https://github.com/Userlovesplay) — Desenvolvido para portfólio.

---

## 🔒 Segurança

- **Use** `.env.example` como template
- **API Key segura** — Use variáveis de ambiente (VITE_)
- **Rate limiting** — Implemente na produção se necessário
- **CORS** — Configure corretamente em produção

---

## 🐛 Troubleshooting

### "GROQ API key not configured"
- Crie um arquivo `.env` na raiz do projeto
- Adicione: `VITE_GROQ_API_KEY=sua_chave`
- Reinicie o servidor (`npm run dev`)

### "Could not parse JSON from Groq response"
- Verifique sua chave de API está válida
- Tente com um modelo diferente em `.env`
- Cheque o console do navegador para mais detalhes

### Modo Demo ativo
- Se a API não estiver disponível, o app usa dados de demonstração
- Configurável para sempre usar demo (altere `groq-api.ts`)

---

## 🔗 Links

- **Demo**: [Gerador de Desculpas](https://gerador-de-desculpas-eight.vercel.app)
- **Portfólio**: [Guilherme Oliveira](https://guilhermeoliveira.dev)

---

> *Cada palavra escolhida tem um custo. Escolha bem.*
