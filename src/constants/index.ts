import type { Canal, Formalidade, Tom } from "@/types";

export const TOM_OPTIONS: { value: Tom; label: string; hint: string }[] = [
  { value: "diplomatico", label: "Diplomático", hint: "Mede cada palavra" },
  { value: "sincero", label: "Sincero", hint: "Vulnerável, sem rodeios" },
  { value: "espirituoso", label: "Espirituoso", hint: "Leve, com discreta ironia" },
  { value: "dramatico", label: "Dramático", hint: "Intensidade calculada" },
  { value: "tecnico", label: "Técnico", hint: "Causa, efeito, mitigação" },
  { value: "vago", label: "Vago", hint: "Diz pouco com elegância" },
];

export const TOM_OPTIONS_EN: { value: Tom; label: string; hint: string }[] = [
  { value: "diplomatico", label: "Diplomatic", hint: "Measures every word" },
  { value: "sincero", label: "Sincere", hint: "Vulnerable, no frills" },
  { value: "espirituoso", label: "Witty", hint: "Light, with subtle irony" },
  { value: "dramatico", label: "Dramatic", hint: "Calculated intensity" },
  { value: "tecnico", label: "Technical", hint: "Cause, effect, mitigation" },
  { value: "vago", label: "Vague", hint: "Says little with elegance" },
];

export const FORM_OPTIONS: { value: Formalidade; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "neutro", label: "Neutro" },
  { value: "formal", label: "Formal" },
  { value: "executivo", label: "Executivo" },
];

export const FORM_OPTIONS_EN: { value: Formalidade; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "neutro", label: "Neutral" },
  { value: "formal", label: "Formal" },
  { value: "executivo", label: "Executive" },
];

export const CANAL_OPTIONS: { value: Canal; label: string }[] = [
  { value: "email", label: "E-mail" },
  { value: "slack", label: "Slack" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "presencial", label: "Presencial" },
  { value: "reuniao", label: "Reunião" },
];

export const CANAL_OPTIONS_EN: { value: Canal; label: string }[] = [
  { value: "email", label: "E-mail" },
  { value: "slack", label: "Slack" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "presencial", label: "In-person" },
  { value: "reuniao", label: "Meeting" },
];

export const EXEMPLOS = [
  "Esqueci de revisar o documento antes da reunião com o cliente e os números estavam desatualizados.",
  "Não consegui entregar o relatório trimestral no prazo combinado com a diretoria.",
  "Cheguei atrasado à standup pela terceira vez nesta semana.",
  "Fui copiado em um e-mail importante há cinco dias e ainda não respondi.",
  "Marquei duas reuniões no mesmo horário e preciso reagendar uma delas com a vice-presidente.",
];

export const EXEMPLOS_EN = [
  "I forgot to review the document before the client meeting and the numbers were outdated.",
  "I couldn't deliver the quarterly report by the deadline agreed with the board.",
  "I arrived late to standup for the third time this week.",
  "I was CC'd on an important email five days ago and still haven't replied.",
  "I scheduled two meetings at the same time and need to reschedule one with the vice-president.",
];

export const PENSANDO = [
  "Pesando as palavras…",
  "Procurando o tom certo…",
  "Polindo as arestas…",
  "Equilibrando candura e cortesia…",
  "Reescrevendo pela quarta vez…",
  "Escolhendo entre vírgula e ponto e vírgula…",
];

export const PENSANDO_EN = [
  "Weighing the words…",
  "Searching for the right tone…",
  "Smoothing the edges…",
  "Balancing candor and courtesy…",
  "Rewriting for the fourth time…",
  "Choosing between comma and semicolon…",
];

export const RISCO_LABELS: Record<string, string> = {
  baixo: "Risco baixo",
  medio: "Risco médio",
  alto: "Risco alto",
};

export const RISCO_LABELS_EN: Record<string, string> = {
  baixo: "Low risk",
  medio: "Medium risk",
  alto: "High risk",
};

export const RISCO_STYLES: Record<string, string> = {
  baixo: "bg-[#e8f5e3] text-[#1b4332] border-[#a3d9a5]",
  medio: "bg-[#fff3cd] text-[#664d03] border-[#ffda6a]",
  alto: "bg-[#f8d7da] text-[#58151c] border-[#f1aeb5]",
};
