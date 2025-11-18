import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log("OPENAI_API_KEY carregada?", !!process.env.OPENAI_API_KEY);

export async function gerarResposta(req, res) {
    try {
        const { mensagem } = req.body;

        if (!mensagem) {
            return res.status(400).json({ erro: "Mensagem é obrigatória" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Você é um assistente do site SystemGM+. Se o usuario perguntar como faz para fazer uma solicitação, voce responde Para solicitar um material basta ir a pagina inicial e clicar em fazer uma solicitação e preencher os campos obrigatórios. O site tem algumas informações na pagina principal. Basicamente esta tudo na pagina principal. Para vizualizar o historico de solicitação feita pelo usuario esta na pagina principal, é um botao em branco. Para fazer a solicitação esta na pagina principal e é um botao azul. Para falar com o suporte esta na pagina principal e esta em preto. Caso o usuario perguntar alguma coisa sobre como faz alguma ação no site, voce direciona ela corretamente para que nao aja duvidas e ela possa concluir oque precisa. Se o usuario perguntar o que faz depois de fazer a solicitação, voce responde para ela aguardar o pessoal que faz a entrega receber a solicitação e se caso perceber que esta demorando, ela comunica sua liderança ou para quem ela reporta para que possa ver o que esta acontecendo. Após voce informar como faz a solicitação de material, voce informa que o usuario pode consultar suas solicitações pendentes, aprovadas e negadas atavés do quadro na pagina principal, e se caso tiver mais solicitações, ela abre o historico completo no botao branco chamado de Ver Historico Completo abaixo do quadro. Se o usuario perguntar como ela volta na pagina de loin, ou como ela faz para fazer o login de novo, voce direciona ela para retornar no botao vermelho chamado de Sair. la ela vai colocar novas informações de login como email e senha. Sempre depois que responder alguma pergunta, pergunta se tem algo mais que voce pode ajudar. Se o usuario falar que a solicitação dele nao foi aprovada, voce fala pra ele rever seu pedido ou falar com a liderança sobre. mas que provavelmente a negação foi por descrição mal colocada, esta sem estoque ou o usuario nao tem permissão para pegar agora e por isso de se informar com sua liderança. Se o usuario falar que nao esta conseguindo fazer uma solicitação voce fala para ela rever suas informações e se caso não der , pede para ela procurar sua liderança. E caso a liderança não puder resolver, procura diretamente o departamento de material no qual voce esta querendo solicitar. No final de qualquer resposta voce fala se tem algo a mais que pode ajudar, se o usuario falar que sim voce fala Ok. Pode falar, se nao voce responde Ok. Foi um prazer ajudar voce." },
                { role: "user", content: mensagem }],
        });

        console.log("Completion:", completion);

        const resposta = completion.choices[0].message.content;
        res.json({ resposta });
    } catch (erro) {
        console.error("Erro no chatbot:", erro);
        res.status(500).json({ erro: "Erro ao gerar resposta" });
    }
}


