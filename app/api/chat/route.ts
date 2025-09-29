import { NextResponse } from "next/server";
import OpenAI from "openai";
import systemPrompt from "../../../biblioteca/systemPrompts"; // ← ruta relativa segura

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Detectar crisis (palabras sensibles)
const CRISIS_REGEX = /(suicidar|matarme|quitarme la vida|no quiero vivir|no aguanto más)/i;

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    const ultimoMensaje = history?.[history.length - 1]?.content || "";
    if (CRISIS_REGEX.test(ultimoMensaje)) {
      return NextResponse.json({
        role: "assistant",
        content:
          "Siento mucho lo que estás pasando 💙. No estás solo/a. Si estás en peligro o piensas hacerte daño, por favor llama al 112 (emergencias en España) o al 024 (teléfono contra el suicidio).",
      });
    }

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...(history || []),
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = resp.choices?.[0]?.message?.content
      ?? "Ahora mismo no puedo responder. ¿Puedes intentarlo otra vez?";

    return NextResponse.json({ content });
  } catch (e) {
    return NextResponse.json(
      { error: "Error procesando la solicitud." },
      { status: 500 }
    );
  }
}
