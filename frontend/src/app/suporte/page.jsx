"use client";

import { useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SuporteChat() {
    const [mensagens, setMensagens] = useState([]);
    const [texto, setTexto] = useState("");
    const router = useRouter();

    const enviarMensagem = async () => {
        if (!texto.trim()) return;

        const msgUsuario = texto;
        setTexto("");

        // Adiciona msg do usuário
        setMensagens((msgs) => [...msgs, { autor: "usuario", texto: msgUsuario }]);

        // Envia para API IA
        const res = await fetch("http://localhost:3001/suporte", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem: msgUsuario }),
        });


        const data = await res.json();

        // Adiciona resposta da IA
        setMensagens((msgs) => [...msgs, { autor: "suporte", texto: data.resposta }]);
    };

    function handleEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            enviarMensagem();
        }
    }

    return (
        <div className="d-flex flex-column align-items-center min-vh-100 bg-light py-4">

            {/* Botão voltar */}
            <div className="container-botao mb-4">
                <button
                    className="btn btn-outline-dark fw-bold px-4 py-2 gap-2"
                    style={{ borderRadius: "10px", borderWidth: "2px" }}
                    onClick={() => router.back()}
                >
                    <i className="bi bi-arrow-left"></i> Voltar
                </button>
            </div>


            {/* Cabeçalho */}
            <div
                className="text-white d-flex align-items-center justify-content-center rounded-top shadow w-100"
                style={{ backgroundColor: "var(--secondary-color)", maxWidth: "600px", padding: "12px 20px" }}
            >
                <img src="/img/gm.svg" alt="Logo GM" height="35" className="me-2" />
                <h2 className="mb-0 fs-4">Suporte GM</h2>
            </div>

            {/* Caixa do chat */}
            <div
                className="bg-white rounded-bottom shadow w-100"
                style={{ maxWidth: "600px" }}
            >
                <div
                    className="overflow-auto p-3 d-flex flex-column"
                    style={{ height: "60vh", background: "#ffffffff" }}
                >
                    {mensagens.map((msg, i) => (
                        <div
                            key={i}
                            className={`p-2 px-3 rounded-4 mb-2 ${msg.autor === "usuario"
                                ? "align-self-end text-white"
                                : "align-self-start text-dark"
                                }`}
                            style={{
                                background:
                                    msg.autor === "usuario" ? "var(--primary-color)" : "var(--user-bubble)",
                                maxWidth: "75%",
                                wordWrap: "break-word",
                            }}
                        >
                            {msg.texto}
                        </div>
                    ))}
                </div>

                {/* Área de input */}
                <div className="d-flex border-top p-2">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Digite sua mensagem..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={handleEnter}
                    />
                    <button className="btn btn-primary" onClick={enviarMensagem}>
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};
