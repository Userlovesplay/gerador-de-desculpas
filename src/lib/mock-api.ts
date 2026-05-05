import type { Desculpa } from "@/types";

function sanitizeLanguage(text: string): string {
  // Remove gírias, palavrões e linguagem informal para ambiente corporativo
  const replacements: [RegExp, string][] = [
    [/\bputo\b|\bputa\b/gi, "insatisfeito"],
    [/\bfudido\b|\bfudida\b/gi, "comprometido"],
    [/\bfudeu\b/gi, "prejudicou"],
    [/\bmerd\w*/gi, "problema"],
    [/\bchato\b/gi, "desagradável"],
    [/\bscrew/gi, "atrapalhou"],
    [/\bmess/gi, "confusão"],
    [/\bsucks?\b/gi, "é ruim"],
  ];
  
  let cleaned = text;
  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

export function generateMockExcuses(
  situacao: string,
  tom: string,
  formalidade: string,
  canal: string = "email",
  language: "pt-BR" | "en" = "pt-BR",
): Desculpa[] {
  const tomLabel = getTomLabel(tom);
  const formalidadeLabel = getFormalidadeLabel(formalidade);

  function normalizeInput(text: string) {
    const t = text
      .trim()
      .replace(/[\s.]+$/g, "")
      .replace(/\s+/g, " ")
      .replace(/\bralatorio\b/gi, "relatório")
      .replace(/\brelatorio\b/gi, "relatório")
      .replace(/\bdaily\b/gi, "daily");
    return t;
  }

  const situacaoNormalized = normalizeInput(situacao);
  const situacaoSanitized = sanitizeLanguage(situacaoNormalized);

  // Build a single clean sentence from the normalized input.
  function buildCleanSentence(text: string) {
    let s = text;
    s = s.replace(/\bdo\s+(relatório|relatorio)\b/gi, "sobre $1");
    s = s.replace(/\bna\s+daily\b/gi, "na daily");
    s = s.replace(/\bno\s+daily\b/gi, "na daily");
    s = s.replace(/\s+\./g, ".");
    s = s.trim();
    // Capitalize first letter and ensure it ends with a period.
    s = s.charAt(0).toUpperCase() + s.slice(1);
    if (!/[.!?]$/.test(s)) s = s + ".";
    return s;
  }

  const cleanedSentence = buildCleanSentence(situacaoSanitized);

  // Extract intent and build a professional paraphrase (subject + body lines)
  function extractIntentAndParaphrase(text: string, lang: "pt-BR" | "en") {
    const lower = text.toLowerCase();
    if (lang === "en") {
      if (/deadline|miss(ed)?|late|delay/.test(lower)) {
        return {
          subject: "Update on missed deadline",
          body: [
            "I acknowledge that I missed the deadline and understand the impact this has on the project. I take full responsibility and have reviewed my process to prevent similar issues.",
            "I am prioritizing completion and can present a revised timeline with clear checkpoints today to restore predictability."
          ]
        };
      }
      if (/server|disk|storage|full/.test(lower)) {
        return {
          subject: "Issue with local server storage",
          body: [
            "There was an issue with local server storage that affected availability. I am addressing the root cause and clearing the necessary resources.",
            "I will follow up with a short report and steps taken to avoid recurrence."
          ]
        };
      }
      return {
        subject: cleanedSentence.replace(/[.!?]$/,'').slice(0,60),
        body: [
          "I understand the situation and am reviewing the details.",
          "I will provide a concise plan with next steps and responsibilities shortly."
        ]
      };
    }

    // Portuguese heuristics
    if (/perd|deadline|prazo|atras/.test(lower)) {
      return {
        subject: "Atualização sobre prazo de entrega",
        body: [
          "Reconheço que não cumpri o prazo e entendo o impacto disso no projeto. Assumo total responsabilidade e já revisei meu processo para corrigir as falhas.",
          "Estou priorizando a conclusão da entrega e posso apresentar ainda hoje um novo cronograma com checkpoints claros para garantir previsibilidade."
        ]
      };
    }
    if (/servidor|limp(ar|ei)|espaço|cheio/.test(lower)) {
      return {
        subject: "Atualização sobre servidor local",
        body: [
          "Houve um problema de armazenamento no servidor local que impactou a operação. Já estou liberando espaço e aplicando correções temporárias.",
          "Em seguida envio um resumo técnico com as ações e as medidas para prevenir recorrência."
        ]
      };
    }

    return {
      subject: cleanedSentence.replace(/[.!?]$/,'').slice(0,60),
      body: [
        "Entendo a situação e estou verificando os detalhes.",
        "Em breve envio um resumo objetivo com os próximos passos e responsáveis."
      ]
    };
  }

  const intent = extractIntentAndParaphrase(situacaoSanitized, language);
  const isEmail = canal === "email";
  const isSlack = canal === "slack";
  const isWhatsapp = canal === "whatsapp";
  const isChat = isSlack || isWhatsapp;
  const subjectShort = sanitizeLanguage(String(intent.subject)).slice(0, 60);

  if (language === "en") {
    const tomLabelEn = getTomLabelEn(tom);
    const formalLabelEn = getFormalidadeLabelEn(formalidade);
    return [
      {
        titulo: `Version ${tomLabelEn} Subtle`,
        texto: isEmail ? `Subject: ${subjectShort}\n\n${intent.body.join('\n\n')}` : `${intent.body.join('\n\n')}`,
        nivelDeRisco: "baixo" as const,
        analise: "This version sounds calm and direct. It works best when you want to acknowledge the issue without sounding stiff or overexplained.",
      },
      {
        titulo: `Version ${formalLabelEn} Direct`,
        texto: isEmail ? `Subject: ${subjectShort}\n\n${intent.body.join('\n\n')}` : `${intent.body.join('\n\n')}`,
        nivelDeRisco: "medio" as const,
        analise: "This version is more straightforward. Use it when you want to sound responsible and practical, without adding extra drama.",
      },
      {
        titulo: `Executive Strategic Version`,
        texto: isEmail ? `Subject: ${subjectShort}\n\n${intent.body.join('\n\n')}` : `${intent.body.join('\n\n')}`,
        nivelDeRisco: "alto" as const,
        analise: "This version is firmer and more assertive. It works when you want to sound in control, but it can feel a bit heavier if the situation is sensitive.",
      },
    ];
  }

  const portuguesVersions: Desculpa[] = [
    {
      titulo: `Versão ${tomLabel} Suttil`,
      texto: isEmail 
        ? `Assunto: ${subjectShort}\n\n${intent.body.join('\n\n')}`
        : `${intent.body.join('\n\n')}`,
      nivelDeRisco: "baixo" as const,
      analise: "Essa versão é mais leve e humana. Funciona quando você quer admitir o problema sem soar engessado.",
    },
    {
      titulo: `Versão ${formalidadeLabel} Direta`,
      texto: isEmail 
        ? `Assunto: ${subjectShort}\n\n${intent.body.join('\n\n')}`
        : `${intent.body.join('\n\n')}`,
      nivelDeRisco: "medio" as const,
      analise: "Essa versão vai mais ao ponto. É útil quando você quer ser objetivo e passar responsabilidade sem enrolar.",
    },
    {
      titulo: `Versão Executiva Estratégica`,
      texto: isEmail 
        ? `Assunto: ${subjectShort}\n\n${intent.body.join('\n\n')}`
        : `${intent.body.join('\n\n')}`,
      nivelDeRisco: "alto" as const,
      analise: "Essa versão soa mais firme e estratégica. Use quando precisar de postura, mas sem cair em texto corporativo demais.",
    }
  ];

  return portuguesVersions;
}

function getTomLabelEn(tom: string): string {
  const labels: Record<string, string> = {
    diplomatico: "Diplomatic",
    sincero: "Sincere",
    espirituoso: "Witty",
    dramatico: "Dramatic",
    tecnico: "Technical",
    vago: "Vague",
  };
  return labels[tom] || tom;
}

function getFormalidadeLabelEn(formalidade: string): string {
  const labels: Record<string, string> = {
    casual: "Casual",
    neutro: "Neutral",
    formal: "Formal",
    executivo: "Executive",
  };
  return labels[formalidade] || formalidade;
}

function getTomLabel(tom: string): string {
  const labels: Record<string, string> = {
    diplomatico: "Diplomática",
    sincero: "Sincera",
    espirituoso: "Espirituosa",
    dramatico: "Dramática",
    tecnico: "Técnica",
    vago: "Vaga"
  };
  return labels[tom] || tom;
}

function getFormalidadeLabel(formalidade: string): string {
  const labels: Record<string, string> = {
    casual: "Casual",
    neutro: "Neutra",
    formal: "Formal",
    executivo: "Executiva"
  };
  return labels[formalidade] || formalidade;
}
