# 🚀 Guia de Configuração - Gerador de Desculpas Profissionais

## ✅ Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta na [Groq](https://console.groq.com) (gratuita)

---

## 📋 Checklist de Configuração

### 1️⃣ Clonar/Preparar o Repositório

```bash
# Se estiver começando do zero
git init
git add .
git commit -m "Initial commit"

# Verificar .gitignore
cat .gitignore
```

**O `.gitignore` já está configurado para:**
- `.env` e `.env.local`
- `node_modules/`
- Arquivos de build
- Arquivos de IDE

---

### 2️⃣ Obter Chave Groq

1. Visite [console.groq.com/keys](https://console.groq.com/keys)
2. Faça login ou crie uma conta
3. Clique em "Create API Key"
4. Copie a chave gerada (ex: `gsk_xXxXxXxXxXxXxXxXxXxX`)

---

### 3️⃣ Configurar Variáveis de Ambiente

#### Desenvolvimento Local

```bash
# Copie o template
cp .env.example .env

# Edite o arquivo .env
# Linux/Mac
nano .env

# Windows PowerShell
notepad .env
```

**Adicione sua chave:**
```env
VITE_GROQ_API_KEY=gsk_xXxXxXxXxXxXxXxXxXxX
VITE_GROQ_MODEL=mixtral-8x7b-32768
```

**Modelos Disponíveis (GRATUITOS):**

| Modelo | Velocidade | Qualidade | Tokens | Melhor para |
|--------|-----------|-----------|--------|------------|
| `mixtral-8x7b-32768` | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 32k | Produção (recomendado) |
| `llama2-70b-4096` | ⭐⭐ | ⭐⭐⭐⭐ | 4k | Testes |
| `gemma-7b-it` | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 8k | API calls frequentes |

---

### 4️⃣ Instalar Dependências

```bash
npm install
```

---

### 5️⃣ Rodar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

### 6️⃣ Testar a Integração

1. Abra o navegador em `http://localhost:5173`
2. Preencha o formulário:
   - **O que aconteceu**: "Perdi o prazo da apresentação"
   - **Tom**: "Diplomático"
   - **Formalidade**: "Formal"
3. Clique em "Gerar três versões"

**Resultado esperado:**
- ✅ 3 variações de desculpas
- ✅ Análise de risco para cada uma
- ✅ Salvo no histórico

---

## 🌐 Deploy em Produção

### Vercel (Recomendado - FREE)

```bash
# 1. Instale Vercel CLI
npm install -g vercel

# 2. Faça deploy
vercel

# 3. Adicione variáveis de ambiente
# Na dashboard do Vercel:
# - Settings > Environment Variables
# - VITE_GROQ_API_KEY = sua chave
# - VITE_GROQ_MODEL = mixtral-8x7b-32768 (opcional)

# 4. Redeploy
vercel --prod
```

### GitHub + Vercel (Automático)

1. Push para GitHub:
```bash
git add .
git commit -m "Configure Groq API"
git push origin main
```

2. Conecte no Vercel:
   - Vá para [vercel.com/new](https://vercel.com/new)
   - Selecione seu repositório GitHub
   - Configure as variáveis de ambiente
   - Deploy automático em cada push

### Netlify

```bash
# Build
npm run build

# A pasta `dist/` será deployada
```

Configure no Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment Variables**: Adicione VITE_GROQ_API_KEY

---

## 🔒 Segurança

### ✅ Fazer

- [x] Adicionar `.env` ao `.gitignore` (já feito)
- [x] Usar `VITE_` prefix para variáveis públicas
- [x] Nunca commitar chaves
- [x] Regenerar chaves se comprometidas

### ❌ Não Fazer

- ❌ Commitar `.env` ou chaves
- ❌ Expor chaves no frontend (já está seguro)
- ❌ Publicar chaves no repositório público
- ❌ Usar a mesma chave em múltiplos projetos

---

## 🐛 Troubleshooting

### Erro: "VITE_GROQ_API_KEY not found"

```bash
# Verificar se o arquivo .env existe
ls -la .env

# Se não existir, copiar do exemplo
cp .env.example .env

# Editar e adicionar a chave
```

### Erro: "401 Unauthorized"

- Chave de API incorreta ou expirada
- Regenere uma nova chave em [console.groq.com/keys](https://console.groq.com/keys)

### Erro: "Could not parse JSON"

- Verifique a chave está válida
- Tente usar outro modelo em `.env`
- Cheque o console do navegador (F12) para detalhes

### App usando "Demo Data"

- Indica que a API Groq não está disponível
- Verifique a chave e conexão internet
- Confira se a variável de ambiente está configurada

---

## 📊 Estrutura de Arquivos Atualizados

```
gerador-de-desculpas/
├── .env.example              # Template (está no repo)
├── .env                       # Variáveis locais (NO gitignore)
├── .gitignore                 # Configurado com .env
├── README.md                  # Atualizado com instruções Groq
├── SETUP.md                   # Este arquivo
├── src/
│   ├── lib/
│   │   ├── mock-api.ts       # Fallback para demo data
│   │   ├── groq-api.ts       # NOVO: Integração Groq
│   │   └── utils.ts
│   ├── pages/
│   │   └── Home.tsx          # ATUALIZADO: Usa Groq com fallback
│   ├── contexts/
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   └── ...
└── vite.config.ts
```

---

## ✨ Próximos Passos

1. **Testes**: Adicionar testes E2E com Cypress
2. **Analytics**: Integrar Posthog para tracking
3. **Feedback**: Adicionar sistema de feedback dos usuários
4. **Histórico em BD**: Usar Supabase para histórico persistente
5. **Rate Limiting**: Implementar no backend

---

## 📚 Links Úteis

- [Documentação Groq](https://console.groq.com/docs)
- [Modelos Disponíveis](https://console.groq.com/docs/models)
- [Vite + React + TypeScript](https://vitejs.dev)
- [Vercel Docs](https://vercel.com/docs)

---

## 💬 Suporte

Se tiver dúvidas ou problemas:
1. Verifique este guia
2. Cheque a documentação do Groq
3. Veja os logs do navegador (F12 > Console)
4. Tente regenerar a chave de API

---

**Pronto para produção! 🚀**
