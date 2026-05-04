import type { Desculpa } from "@/types";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "mixtral-8x7b-32768";

export async function generateExcusesWithGroq(
  situacao: string,
  tom: string,
  formalidade: string,
  destinatario?: string,
  incluirJustificativa?: boolean,
  incluirReparo?: boolean,
  language: "pt-BR" | "en" = "pt-BR",
): Promise<Desculpa[]> {
  if (!GROQ_API_KEY) {
    throw new Error(
      "GROQ API key not configured. Please set VITE_GROQ_API_KEY in your .env file"
    );
  }

  const prompt = buildPrompt(
    situacao,
    tom,
    formalidade,
    destinatario,
    incluirJustificativa,
    incluirReparo
  );

  const systemMessage =
    language === "en"
      ? "You are an expert in professional communication and crafting well-written excuses. Generate exactly 3 versions of excuses with different tones and risk levels. Return ONLY valid JSON (either an array or an object with a 'desculpas' array). Each item must include titulo, texto, nivelDeRisco (baixo/medio/alto), and analise. Respond in English."
      : "Você é um especialista em comunicação profissional e redação de desculpas. Gere exatamente 3 versões com diferentes tons e níveis de risco. Retorne SOMENTE JSON válido (ou um array ou um objeto com uma chave 'desculpas'). Cada item deve incluir titulo, texto, nivelDeRisco (baixo/medio/alto) e analise. Responda em Português (pt-BR).";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || `Groq API error: ${response.status}`
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content in Groq response");
    }

    let parsedContent: unknown;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!match) throw new Error("Could not parse JSON from Groq response");
      parsedContent = JSON.parse(match[0]);
    }

    const excuses = Array.isArray(parsedContent)
      ? (parsedContent as Desculpa[])
      : Array.isArray((parsedContent as { desculpas?: unknown }).desculpas)
        ? (parsedContent as { desculpas: Desculpa[] }).desculpas
        : null;

    if (!excuses) {
      throw new Error("Could not parse JSON from Groq response");
    }

    // Validate the response
    if (!Array.isArray(excuses) || excuses.length !== 3) {
      throw new Error("Groq API did not return exactly 3 excuses");
    }

    return excuses;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate excuses: ${error.message}`);
    }
    throw error;
  }
}

function buildPrompt(
  situacao: string,
  tom: string,
  formalidade: string,
  destinatario?: string,
  incluirJustificativa?: boolean,
  incluirReparo?: boolean
): string {
  const tomDescriptions: Record<string, string> = {
    diplomatico:
      "diplomatic and formal, prioritizing relationship preservation",
    sincero: "sincere and honest, acknowledging the issue directly",
    espirituoso: "witty and clever, using humor to defuse tension",
    dramatico: "dramatic and emotional, conveying the seriousness",
    tecnico: "technical and precise, focusing on details",
    vago: "vague and ambiguous, leaving room for interpretation",
  };

  const formalidadeDescriptions: Record<string, string> = {
    casual: "casual and friendly",
    neutro: "neutral and balanced",
    formal: "formal and professional",
    executivo: "executive and strategic",
  };

  let prompt = `Generate exactly 3 versions of professional excuses for the following situation:

**Situation**: ${situacao.trim()}

**Desired Tone**: ${tomDescriptions[tom] || tom}
**Formality Level**: ${formalidadeDescriptions[formalidade] || formalidade}`;

  if (destinatario) {
    prompt += `\n**Recipient**: ${destinatario}`;
  }

  if (incluirJustificativa) {
    prompt +=
      "\n**Include**: A brief justification or explanation for the situation";
  }

  if (incluirReparo) {
    prompt +=
      "\n**Include**: A concrete proposal or next step to resolve the situation";
  }

  prompt += `

Generate 3 versions with different risk levels:
1. **Version 1 (baixo risk)**: More diplomatic and safe
2. **Version 2 (medio risk)**: Balanced approach
3. **Version 3 (alto risk)**: More assertive and direct

For each version provide:
- titulo: A descriptive title for the version
- texto: The full excuse text (2-3 paragraphs, natural language)
- nivelDeRisco: "baixo", "medio", or "alto"
- analise: Brief analysis of when and how to use this version (2-3 sentences)

Return ONLY a JSON array with exactly 3 objects. No additional text.`;

  return prompt;
}
