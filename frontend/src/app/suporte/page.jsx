"use client";

import { useState } from "react";
import "../globals.css";

export default function SuporteChat() {
    const [mensagens, setMensagens] = useState([]);
    const [texto, setTexto] = useState("");

    const enviarMensagem = async () => {
        if (!texto.trim()) return;

        const msgUsuario = texto;
        setTexto("");

        // Adiciona msg do usuário
        setMensagens((msgs) => [...msgs, { autor: "usuario", texto: msgUsuario }]);

        // Envia para API IA
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem: msgUsuario }),
        });

        const data = await res.json();

        // Adiciona resposta da IA
        setMensagens((msgs) => [...msgs, { autor: "suporte", texto: data.resposta }]);
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="mensagens">
                    {mensagens.map((msg, i) => (
                        <div key={i} className={`msg ${msg.autor}`}>
                            {msg.texto}
                        </div>
                    ))}
                </div>
            </div>

            <div className="input-area">
                <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button onClick={enviarMensagem}>Enviar</button>
            </div>
        </div>
    );
}
