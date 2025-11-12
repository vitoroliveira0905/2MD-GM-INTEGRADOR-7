import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log("🔑 OPENAI_API_KEY carregada?", !!process.env.OPENAI_API_KEY);

export async function gerarResposta(req, res) {
    try {
        const { mensagem } = req.body;

        if (!mensagem) {
            return res.status(400).json({ erro: "Mensagem é obrigatória" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: mensagem }],
        });

        console.log("🧩 Completion:", completion);

        const resposta = completion.choices[0].message.content;
        res.json({ resposta });
    } catch (erro) {
        console.error("Erro no chatbot:", erro);
        res.status(500).json({ erro: "Erro ao gerar resposta" });
    }
}
