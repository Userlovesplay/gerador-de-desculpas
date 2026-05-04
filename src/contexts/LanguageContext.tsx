import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "pt-BR" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  "pt-BR": {
    "title": "Gerador de Desculpas Profissionais",
    "subtitle": "O ghostwriter discreto das suas desculpas profissionais.",
    "headerSubtitle": "Edição contínua — Vol. 01",
    "heroTitle": "O ghostwriter discreto",
    "heroSubtitle": "das suas desculpas profissionais.",
    "heroDescription": "Para quem reescreve uma mensagem seis vezes antes de mandar. Conte o que aconteceu — devolvemos três versões, cada uma com seu peso, seu tom e suas consequências.",
    "loading": "Carregando...",
    "thinking": "Pensando...",
    "generate": "Gerar três versões",
    "generating": "Redigindo",
    "copy": "Copiar texto",
    "copied": "Copiado",
    "copiedToast": "Copiado para a área de transferência",
    "copiedDesc": "Cole onde precisar — está pronto para enviar.",
    "copyError": "Erro ao copiar",
    "copyErrorDesc": "Tente selecionar e copiar o texto manualmente.",
    "results": "Três versões",
    "resultsHint": "Da mais contida à mais arriscada",
    "analysis": "Análise da redação",
    "demoMode": "Demo Mode",
    "demoDesc": "API indisponível. Usando dados simulados para demonstração.",
    "footerText": "Cada palavra escolhida tem um custo. Escolha bem.",
    "footerRights": "Gerador de Desculpas Profissionais — Edição 01",
    "repository": "Repositório",
    "portfolio": "Portfólio",
    "readmeBadgeVite": "Vite 7.3.2",
    "readmeBadgeReact": "React 19.1.0",
    "readmeBadgeTS": "TypeScript 5.8",
    "readmeBadgeTailwind": "Tailwind CSS 4.1.14",
    "readmeFeatures": "Funcionalidades",
    "readmeFeature1": "3 Variações instantâneas",
    "readmeFeature1Desc": "Cada geração traz três opções com níveis diferentes de risco",
    "readmeFeature2": "6 tons de comunicação",
    "readmeFeature2Desc": "Diplomático, Sincero, Espirituoso, Dramático, Técnico, Vago",
    "readmeFeature3": "4 níveis de formalidade",
    "readmeFeature3Desc": "Casual, Neutro, Formal, Executivo",
    "readmeFeature4": "5 canais otimizados",
    "readmeFeature4Desc": "E-mail, Slack, WhatsApp, Presencial, Reunião",
    "readmeFeature5": "Histórico persistente",
    "readmeFeature5Desc": "Suas últimas 5 gerações salvas no localStorage",
    "readmeFeature6": "Modo Demo",
    "readmeFeature6Desc": "Funciona sem backend usando dados simulados",
    "readmeFeature7": "Design editorial",
    "readmeFeature7Desc": "Tipografia serifada, animações suaves, scrollbar personalizada",
    "variationsPerGeneration": "Variações por geração",
    "resetButton": "Reiniciar",
    "generateButton": "Gerar três versões",
    "generatingButton": "Redigindo",
    "copyButton": "Copiar texto",
    "copiedButton": "Copiado",
    "emptyStateI": "I.",
    "emptyStateII": "II.",
    "emptyStateIII": "III.",
    "emptyStateIDesc": "Diga o que houve",
    "emptyStateIDescDetail": "Sem maquiar. Quanto mais nítido o contexto, mais afiado o resultado.",
    "emptyStateIIDesc": "Ajuste o registro",
    "emptyStateIIDescDetail": "Tom, formalidade e canal mudam tudo. Slack não é e-mail. Chefe não é cliente.",
    "emptyStateIIIDesc": "Receba três versões",
    "emptyStateIIIDescDetail": "Cada uma com risco aferido e uma análise sobre quando usá-la.",
    "manifestoText": "Não acreditamos em desculpas vazias. Acreditamos em palavras que reconhecem o que houve, propõem um caminho e permitem que a conversa continue.",
    "situacaoLabel": "O que aconteceu",
    "situacaoPlaceholder": "Descreva a situação com algum contexto — o que aconteceu, com quem, e o que precisa ser dito.",
    "destinatarioLabel": "Destinatário",
    "destinatarioHint": "Opcional — chefe, cliente, equipe, vice-presidente…",
    "destinatarioPlaceholder": "Para quem vai? (opcional)",
    "detalhesLabel": "Detalhes adicionais",
    "toggleJustificativa": "Incluir uma justificativa breve",
    "toggleJustificativaDesc": "A desculpa traz um motivo plausível, sem se estender.",
    "toggleReparo": "Oferecer reparo ou próximo passo",
    "toggleReparoDesc": "Encerra com uma proposta concreta para resolver.",
    "tomLabel": "Tom",
    "formalidadeLabel": "Formalidade",
    "canalLabel": "Canal",
    "versaoLabel": "Versão",
    "preparingVersions": "Três versões em preparação",
    "exemplosLabel": "Exemplos:",
    "manifesto": "Manifesto",
    "historicoTitle": "Histórico desta sessão",
    "historicoEmpty": "Suas últimas gerações aparecerão aqui — para comparar versões antes de enviar.",
  },
  "en": {
    "title": "Professional Excuse Generator",
    "subtitle": "The discreet ghostwriter for your professional excuses.",
    "headerSubtitle": "Continuous Edition — Vol. 01",
    "heroTitle": "The discreet ghostwriter",
    "heroSubtitle": "for your professional excuses.",
    "heroDescription": "For those who rewrite a message six times before sending. Tell us what happened — we deliver three versions, each with its own weight, tone and consequences.",
    "loading": "Loading...",
    "thinking": "Thinking...",
    "generate": "Generate three versions",
    "generating": "Writing",
    "copy": "Copy text",
    "copied": "Copied",
    "copiedToast": "Copied to clipboard",
    "copiedDesc": "Paste wherever you need — it's ready to send.",
    "copyError": "Copy error",
    "copyErrorDesc": "Try selecting and copying the text manually.",
    "results": "Three versions",
    "resultsHint": "From most contained to most risky",
    "analysis": "Writing analysis",
    "demoMode": "Demo Mode",
    "demoDesc": "API unavailable. Using simulated data for demonstration.",
    "footerText": "Every word chosen has a cost. Choose wisely.",
    "footerRights": "Professional Excuse Generator — Edition 01",
    "repository": "Repository",
    "portfolio": "Portfolio",
    "readmeBadgeVite": "Vite 7.3.2",
    "readmeBadgeReact": "React 19.1.0",
    "readmeBadgeTS": "TypeScript 5.8",
    "readmeBadgeTailwind": "Tailwind CSS 4.1.14",
    "readmeFeatures": "Features",
    "readmeFeature1": "3 Instant Variations",
    "readmeFeature1Desc": "Each generation brings three options with different risk levels",
    "readmeFeature2": "6 Communication Tones",
    "readmeFeature2Desc": "Diplomatic, Sincere, Witty, Dramatic, Technical, Vague",
    "readmeFeature3": "4 Formality Levels",
    "readmeFeature3Desc": "Casual, Neutral, Formal, Executive",
    "readmeFeature4": "5 Optimized Channels",
    "readmeFeature4Desc": "E-mail, Slack, WhatsApp, In-person, Meeting",
    "readmeFeature5": "Persistent History",
    "readmeFeature5Desc": "Your last 5 generations saved in localStorage",
    "readmeFeature6": "Demo Mode",
    "readmeFeature6Desc": "Works without backend using simulated data",
    "readmeFeature7": "Editorial Design",
    "readmeFeature7Desc": "Serif typography, smooth animations, custom scrollbar",
    "variationsPerGeneration": "Variations per generation",
    "resetButton": "Restart",
    "generateButton": "Generate three versions",
    "generatingButton": "Writing",
    "copyButton": "Copy text",
    "copiedButton": "Copied",
    "emptyStateI": "I.",
    "emptyStateII": "II.",
    "emptyStateIII": "III.",
    "emptyStateIDesc": "Say what happened",
    "emptyStateIDescDetail": "Without embellishment. The clearer the context, the sharper the result.",
    "emptyStateIIDesc": "Adjust the register",
    "emptyStateIIDescDetail": "Tone, formality, and channel change everything. Slack is not email. Boss is not client.",
    "emptyStateIIIDesc": "Receive three versions",
    "emptyStateIIIDescDetail": "Each with risk assessed and an analysis of when to use it.",
    "manifestoText": "We don't believe in empty excuses. We believe in words that acknowledge what happened, propose a way forward, and allow the conversation to continue.",
    "situacaoLabel": "What happened",
    "situacaoPlaceholder": "Describe the situation with some context — what happened, with whom, and what needs to be said.",
    "destinatarioLabel": "Recipient",
    "destinatarioHint": "Optional — to boss, client, team, vice-president…",
    "destinatarioPlaceholder": "Who is it for? (optional)",
    "detalhesLabel": "Additional details",
    "toggleJustificativa": "Include a brief justification",
    "toggleJustificativaDesc": "The excuse brings a plausible reason, without extending.",
    "toggleReparo": "Offer repair or next step",
    "toggleReparoDesc": "Ends with a concrete proposal to resolve.",
    "tomLabel": "Tone",
    "formalidadeLabel": "Formality",
    "canalLabel": "Channel",
    "versaoLabel": "Version",
    "preparingVersions": "Three versions in preparation",
    "exemplosLabel": "Examples:",
    "manifesto": "Manifesto",
    "historicoTitle": "Session history",
    "historicoEmpty": "Your last generations will appear here — to compare versions before sending.",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "en" || saved === "pt-BR") ? saved : "pt-BR";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["pt-BR"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}