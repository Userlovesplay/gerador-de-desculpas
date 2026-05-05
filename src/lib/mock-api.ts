import type { Desculpa } from "@/types";

export function sanitizeLanguage(text: string): string {
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
  const channelKey = normalizeChannel(canal);

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
  const subjectShort = sanitizeLanguage(String(intent.subject)).slice(0, 60);
  const variants = buildVariants({
    language,
    tom,
    formalidade,
    canal: channelKey,
    tomLabel,
    formalidadeLabel,
    subjectShort,
    intentBody: intent.body,
  });

  return variants;
}

function buildVariants({
  language,
  tom,
  formalidade,
  canal,
  tomLabel,
  formalidadeLabel,
  subjectShort,
  intentBody,
}: {
  language: "pt-BR" | "en";
  tom: string;
  formalidade: string;
  canal: string;
  tomLabel: string;
  formalidadeLabel: string;
  subjectShort: string;
  intentBody: string[];
}): Desculpa[] {
  const isEmail = canal === "email";
  const isChat = canal === "slack" || canal === "whatsapp";
  const isLive = canal === "presencial" || canal === "reuniao";
  const base = createBaseMessage(language, tom, formalidade, canal, intentBody);
  const followUp = createFollowUpMessage(language, tom, formalidade, canal);
  const closing = createClosingMessage(language, tom, formalidade, canal);

  const formatText = (body: string[]) => {
    if (isEmail) {
      return `Subject: ${subjectShort}\n\n${body.join('\n\n')}`;
    }
    if (isChat) {
      return body.join(' ');
    }
    if (isLive) {
      return body.join('\n\n');
    }
    return body.join('\n\n');
  };

  if (language === "en") {
    return [
      {
        titulo: `Version ${getTomLabelEn(tom)} Subtle`,
        texto: formatText([base.subtle, followUp.subtle]),
        nivelDeRisco: "baixo" as const,
        analise: "This version is calm and clear. It keeps the message professional without sounding rigid or overly defensive.",
      },
      {
        titulo: `Version ${getFormalidadeLabelEn(formalidade)} Direct`,
        texto: formatText([base.direct, followUp.direct]),
        nivelDeRisco: "medio" as const,
        analise: "This version is more structured. It is a good fit when you need to show ownership and next steps without adding noise.",
      },
      {
        titulo: "Executive Strategic Version",
        texto: formatText([base.executive, closing.executive]),
        nivelDeRisco: "alto" as const,
        analise: "This version sounds firmer and more managerial. It works when you need authority and a concrete recovery plan.",
      },
    ];
  }

  const toneHint = getToneHintPt(tom);
  const formalityHint = getFormalityHintPt(formalidade);
  const liveHint = isLive
    ? "Em conversa presencial ou reunião, a formulação fica mais natural, sem o peso de um texto de e-mail."
    : "";

  return [
    {
      titulo: `Versão ${tomLabel} Sutil`,
      texto: formatText([base.subtle, followUp.subtle]),
      nivelDeRisco: "baixo" as const,
      analise: `${toneHint} ${liveHint}`.trim(),
    },
    {
      titulo: `Versão ${formalidadeLabel} Direta`,
      texto: formatText([base.direct, followUp.direct]),
      nivelDeRisco: "medio" as const,
      analise: `${formalityHint} ${liveHint}`.trim(),
    },
    {
      titulo: "Versão Executiva Estratégica",
      texto: formatText([base.executive, closing.executive]),
      nivelDeRisco: "alto" as const,
      analise: `Essa versão reforça responsabilidade e plano de ação. ${liveHint}`.trim(),
    },
  ];
}

function createBaseMessage(
  language: "pt-BR" | "en",
  tom: string,
  formalidade: string,
  canal: string,
  intentBody: string[],
) {
  const technical = tom === "tecnico";
  const formal = formalidade === "formal" || formalidade === "executivo";
  const live = canal === "presencial" || canal === "reuniao";

  if (language === "en") {
    const opening = technical
      ? "I want to be transparent about the issue and the impact it created."
      : formal
        ? "I want to acknowledge the issue clearly and professionally."
        : "I wanted to flag the situation honestly and without unnecessary detail.";

    const middle = live
      ? "I have already reviewed the situation and I am focused on correcting it as quickly as possible."
      : intentBody[0];

    return {
      subtle: `${opening} ${middle}`,
      direct: `${middle} ${intentBody[1] ?? "I will send the follow-up with the next steps shortly."}`,
      executive: `${opening} I have already reviewed the process, identified the gap, and started the correction plan.`,
    };
  }

  const opening = technical
    ? "Reconheço o ponto técnico da situação e o impacto que isso gerou no andamento."
    : formal
      ? "Reconheço a ocorrência e quero tratar o assunto com objetividade e responsabilidade."
      : "Quero tratar essa situação de forma direta e sem rodeios.";

  const middle = live
    ? "Já revisei o contexto e estou focado em corrigir o problema com o mínimo de ruído possível."
    : intentBody[0];

  return {
    subtle: `${opening} ${middle}`,
    direct: `${middle} ${intentBody[1] ?? "Em seguida, apresento os próximos passos de forma clara."}`,
    executive: `${opening} Já revisei o fluxo, identifiquei a falha e iniciei a correção para evitar recorrência.`,
  };
}

function createFollowUpMessage(
  language: "pt-BR" | "en",
  tom: string,
  formalidade: string,
  canal: string,
) {
  const technical = tom === "tecnico";
  const formal = formalidade === "formal" || formalidade === "executivo";
  const live = canal === "presencial" || canal === "reuniao";

  if (language === "en") {
    return {
      subtle: live
        ? "I can share a concise recovery plan with checkpoints right after this conversation."
        : "I can share a concise recovery plan with checkpoints today.",
      direct: technical
        ? "I am prioritizing the delivery and can provide a revised timeline with clear checkpoints today."
        : formal
          ? "I am prioritizing the correction and can provide a clear action plan today."
          : "I can send the next steps today in a simple and direct format.",
      executive: "I am prioritizing the delivery and can present a revised timeline with checkpoints today to restore predictability.",
    };
  }

  return {
    subtle: live
      ? "Posso apresentar um encaminhamento objetivo com os próximos passos assim que encerrarmos."
      : "Posso enviar um encaminhamento objetivo com os próximos passos ainda hoje.",
    direct: technical
      ? "Estou priorizando a entrega e posso apresentar ainda hoje um novo cronograma com checkpoints claros."
      : formal
        ? "Estou priorizando a correção e posso enviar ainda hoje um plano de ação claro."
        : "Posso mandar hoje mesmo os próximos passos em formato simples e direto.",
    executive: "Estou priorizando a entrega e posso apresentar ainda hoje um novo cronograma com checkpoints claros para garantir previsibilidade.",
  };
}

function createClosingMessage(
  language: "pt-BR" | "en",
  tom: string,
  formalidade: string,
  canal: string,
) {
  const technical = tom === "tecnico";
  const formal = formalidade === "formal" || formalidade === "executivo";
  const live = canal === "presencial" || canal === "reuniao";

  if (language === "en") {
    return {
      subtle: live
        ? "I am available to answer questions and align on the next step right now."
        : "I am available to answer questions and align on the next step.",
      direct: technical
        ? "I will keep the communication short and focused on the corrective actions."
        : formal
          ? "I will keep the communication objective and focused on the corrective actions."
          : "I will keep the communication simple and focused on the corrective actions.",
      executive: "I will keep the communication focused on ownership, recovery, and follow-through.",
    };
  }

  return {
    subtle: live
      ? "Fico à disposição para alinhar os detalhes e responder o que for necessário agora mesmo."
      : "Fico à disposição para alinhar os detalhes e responder o que for necessário.",
    direct: technical
      ? "Vou manter a comunicação objetiva e focada nas correções necessárias."
      : formal
        ? "Vou manter a comunicação objetiva e concentrada nas correções necessárias."
        : "Vou manter a comunicação simples e focada no que precisa ser feito.",
    executive: "Vou manter a comunicação centrada em responsabilidade, recuperação e acompanhamento.",
  };
}

function normalizeChannel(canal: string) {
  return canal === "reuniao" ? "presencial" : canal;
}

function getToneHintPt(tom: string) {
  const hints: Record<string, string> = {
    tecnico: "O tom técnico traz precisão e reduz a chance de soar improvisado.",
    sincero: "O tom sincero deixa a admissão mais humana, sem perder a postura.",
    diplomatico: "O tom diplomático ajuda a suavizar a mensagem sem tirar a responsabilidade.",
    dramatico: "O tom dramático fica mais intenso, então a versão mantém o texto controlado.",
    espirituoso: "O tom espirituoso é contido aqui para continuar apropriado ao ambiente profissional.",
    vago: "O tom vago vira uma formulação mais neutra para evitar ruído desnecessário.",
  };
  return hints[tom] || "A formulação foi ajustada para ficar profissional e coerente com o pedido.";
}

function getFormalityHintPt(formalidade: string) {
  const hints: Record<string, string> = {
    casual: "A formalidade casual deixa o texto mais próximo de uma conversa real.",
    neutro: "A formalidade neutra mantém equilíbrio entre clareza e profissionalismo.",
    formal: "A formalidade alta reforça responsabilidade e organização na mensagem.",
    executivo: "A formalidade executiva eleva a mensagem para um tom mais institucional.",
  };
  return hints[formalidade] || "A formalidade foi ajustada para preservar clareza e postura.";
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
