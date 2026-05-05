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
      ? "You are a human writer helping someone reply naturally about a real situation. Use simple, direct language and avoid generic, corporate, or templated phrases. Make each version feel specific to the situation, the recipient, and the chosen tone. Generate exactly 3 versions with different risk levels. Return ONLY valid JSON (either an array or an object with a 'desculpas' array). Each item must include titulo, texto, nivelDeRisco (baixo/medio/alto), and analise. Respond in English."
      : "Você é uma pessoa escrevendo uma resposta natural sobre uma situação real. Use linguagem simples, direta e humana. Evite frases genéricas, corporativas ou com cara de template. Faça cada versão soar específica para a situação, o destinatário e o tom escolhido. Gere exatamente 3 versões com diferentes níveis de risco. Retorne SOMENTE JSON válido (ou um array ou um objeto com uma chave 'desculpas'). Cada item deve incluir titulo, texto, nivelDeRisco (baixo/medio/alto) e analise. Responda em Português (pt-BR).";

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

  const userText = situacao.trim();

  let prompt = `You are given a short, possibly informal description written by a person. The original user text is below — it may include slang, shortcuts, typos, or casual language. Use that text as the factual source: do not invent new facts, names, dates, or outcomes. First, rewrite the user's text into a single clear sentence, correcting obvious typos and normalizing names (e.g., capitalize proper names). Do NOT echo the raw original text; use only the cleaned sentence as the basis for the versions.

  Original user text: "${userText}"

  Cleaned sentence: (produce internally; do not expose the cleaning steps in the output)

  Now, generate exactly 3 versions of professional responses for this situation based on the cleaned sentence:

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

  // Guidance for handling informal input and slang
  prompt += `\n\nGuidelines for rewriting:\n- Use the user's wording as the factual source; do not add or invent facts.\n- If the user used slang or very casual phrasing, translate it into a clear, professional equivalent that keeps the same meaning.\n- Keep language simple and human; avoid corporate jargon or templated-sounding phrasing.\n- Keep names, dates, and core facts intact.\n- Do not add apologies or statements that aren't supported by the user's text (e.g., don't claim you fixed something unless the user said so).`;

  prompt += `

Generate 3 versions with different risk levels:
1. **Version 1 (baixo risk)**: More diplomatic and safe
2. **Version 2 (medio risk)**: Balanced approach
3. **Version 3 (alto risk)**: More assertive and direct

For each version provide:
- titulo: A descriptive title for the version
- texto: The full excuse text in simple, natural language. Make it sound like a person wrote it, not a template. Use the situation details instead of generic filler.
- nivelDeRisco: "baixo", "medio", or "alto"
- analise: Brief analysis of when and how to use this version (2-3 sentences), also in simple language

Return ONLY a JSON array with exactly 3 objects. No additional text.`;

  return prompt;
}
