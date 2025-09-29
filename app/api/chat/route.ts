import { NextResponse } from "next/server";
import OpenAI from "openai";
import systemPrompt from "@/lib/systemPrompt";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CRISIS_REGEX = /(suicid|autoles|me\s*quiero\s*morir|hacerme\s*daño|no\s*quiero\s*vivir)/i;

export async function POST(req: Request) {
  try {
    const { history }: { history: Array<{ role: "user" | "assistant"; content: string }> } = await req.json();

    const lastUserMsg = [...history].reverse().find(m => m.role === "user")?.content ?? "";
    if (CRISIS_REGEX.test(lastUserMsg)) {
      const msg = "Siento que estés pasando por algo tan duro. No estás solo/a. Si estás en peligro o piensas hacerte daño, por favor busca ayuda inmediata: \uD83D\uDCDE 112 (emergencias) o 024 (salud mental 24h, España). Habla con alguien de confianza ahora mismo si puedes. Estoy aquí para acompañarte.";
      return NextResponse.json({ content: msg });
    }

    // Recorta historial para controlar coste
    const trimmed = history.slice(-20);

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmed
      ],
      max_tokens: 450
    });

    const content = resp.choices[0]?.message?.content ?? "Ahora mismo no puedo responder. ¿Intentas de nuevo?";
    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json({ content: "Ha ocurrido un error. Inténtalo más tarde." }, { status: 500 });
  }
}
