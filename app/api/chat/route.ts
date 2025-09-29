import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/systemPrompts";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content || "Lo siento, no tengo respuesta en este momento.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
