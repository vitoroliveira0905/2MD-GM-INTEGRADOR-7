import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  try {
    const { mensagem } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Você é um atendente de suporte educado, direto e simpático." },
        { role: "user", content: mensagem }
      ],
    });

    const resposta = completion.choices[0].message.content;

    return NextResponse.json({ resposta });

  } catch (error) {
    console.error("Erro no chat API:", error);
    return NextResponse.json({ resposta: "Ocorreu um erro ao processar sua mensagem." });
  }
}
