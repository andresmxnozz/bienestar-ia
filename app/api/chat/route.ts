import { NextResponse } from "next/server";
import OpenAI from "openai";
import { systemPrompt } from "@/lib/systemPrompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Expresión regular para detectar crisis
const CRISIS_REGEX = /(suicidar|matarme|quitarme la vida|no quiero vivir|no aguanto más)/i;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Buscar palabras de crisis
    const ultimoMensaje = messages[messages.length - 1]?.content || "";
    if (CRISIS_REGEX.test(ultimoMensaje)) {
      return NextResponse.json({
        role: "assistant",
        content:
          "Siento mucho lo que estás pasando 💙. No estás solo/a. Si estás en peligro o piensas hacerte daño, por favor busca ayuda inmediata: LLAMA al 112 (emergencias en España) o al 024 (teléfono contra el suicidio).",
      });
    }

    // Llamar al modelo de OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error("Error en el endpoint:", error);
    return NextResponse.json(
      { error: "Error procesando la solicitud." },
      { status: 500 }
    );
  }
}
