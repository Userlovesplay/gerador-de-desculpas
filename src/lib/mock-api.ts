import type { Desculpa } from "@/types";

export function generateMockExcuses(
  situacao: string,
  tom: string,
  formalidade: string,
  language: "pt-BR" | "en" = "pt-BR",
): Desculpa[] {
  const tomLabel = getTomLabel(tom);
  const formalidadeLabel = getFormalidadeLabel(formalidade);

  if (language === "en") {
    const tomLabelEn = getTomLabelEn(tom);
    const formalLabelEn = getFormalidadeLabelEn(formalidade);
    return [
      {
        titulo: `Version ${tomLabelEn} Subtle`,
        texto: `Dear all, I want to convey my sincere regret regarding the situation: ${situacao.toLowerCase()}. I understand the importance of this matter and am taking steps to ensure it does not happen again. Thank you for your understanding; I'm available to discuss how we can prevent this moving forward.`,
        nivelDeRisco: "baixo" as const,
        analise: "This version prioritizes diplomacy and relationship preservation. The tone is respectful and solution-focused, minimizing friction.",
      },
      {
        titulo: `Version ${formalLabelEn} Direct`,
        texto: `Hello. Unfortunately ${situacao.toLowerCase()}. I have identified the causes and am actively working to resolve them. I commit to preventing similar issues in the future and am available to align next steps.`,
        nivelDeRisco: "medio" as const,
        analise: "This version is more direct and admits the issue. Risk is moderate as it may come off less polished, but it shows responsibility and proactivity.",
      },
      {
        titulo: `Executive Strategic Version`,
        texto: `Team, in light of ${situacao.toLowerCase()}, I have implemented an immediate review protocol to safeguard our quality standards. This will strengthen our internal processes. I propose a short meeting to align next steps and ensure strategic continuity.`,
        nivelDeRisco: "alto" as const,
        analise: "This version focuses on high-level solutions and decisive action. It carries more risk due to a firmer tone, but it conveys leadership and control.",
      },
    ];
  }

  return [
    {
      titulo: `Versão ${tomLabel} Suttil`,
      texto: `Prezado(a), gostaria de transparecer minha sinceridade quanto à situação: ${situacao.toLowerCase()}. Reconheço a importância deste momento e estou tomando as medidas necessárias para que não ocorra novamente. Agradeço sua compreensão e estou à disposição para discutirmos como evitar que isso se repita.`,
      nivelDeRisco: "baixo" as const,
      analise: "Esta versão prioriza a diplomacia e a preservação do relacionamento. O tom é respeitoso e foca na solução, minimizando atritos.",
    },
    {
      titulo: `Versão ${formalidadeLabel} Direta`,
      texto: `Olá. Infelizmente ${situacao.toLowerCase()}. Já identifiquei os pontos que levaram a isso e estou trabalhando ativamente para resolver. Preciso que saibam que me comprometo a não deixar que situações semelhantes ocorram novamente. Estou à disposição para alinharmos próximos passos.`,
      nivelDeRisco: "medio" as const,
      analise: "Esta versão é mais direta e admitida a situação. O risco é moderado pois pode parecer menos polido, mas demonstra responsabilidade e proatividade.",
    },
    {
      titulo: `Versão Executiva Estratégica`,
      texto: `Prezados, diante de ${situacao.toLowerCase()}, implementei imediatamente um protocolo de revisão para garantir que nossos padrões de qualidade sejam mantidos. Esta experiência servirá para fortalecer nossos processos internos. Agendo uma breve reunião para alinharmos as próximas etapas e garantirmos que estejamos todos na mesma página estratégica.`,
      nivelDeRisco: "alto" as const,
      analise: "Esta versão foca em soluções de alto nível e tomada de decisão estratégica. O risco é maior pois o tom é mais assertivo e pode parecer distante, mas transmite liderança e controle da situação.",
    }
  ];
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
