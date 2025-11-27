"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import "@/app/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";


export default function ChatWidget() {
    const [mensagens, setMensagens] = useState([]);
    const [texto, setTexto] = useState("");
    const [carregando, setCarregando] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensagens, carregando]);


    // 🔥 Perguntas rápidas (useMemo evita recriação em toda renderização)
    const perguntasRapidas = useMemo(() => [
        "Como faço uma nova solicitação?",
        "Como vejo o status da minha solicitação?",
        "Com quem falo quando demora para aprovar?"
    ], []);

    // 🔥 Função aprimorada com loading para evitar spam
    const enviarMensagem = useCallback(async (mensagemForcada = null) => {
        const msgUsuario = mensagemForcada || texto;
        if (!msgUsuario.trim() || carregando) return;

        if (!mensagemForcada) setTexto("");

        // Adiciona mensagem do usuário
        setMensagens((msgs) => [...msgs, { autor: "usuario", texto: msgUsuario }]);

        setCarregando(true);

        try {
            const res = await fetch("http://localhost:3001/suporte", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mensagem: msgUsuario }),
            });

            const data = await res.json();

            setMensagens((msgs) => [
                ...msgs,
                { autor: "suporte", texto: data?.resposta || "Erro ao processar resposta." }
            ]);
        } catch (err) {
            setMensagens((msgs) => [
                ...msgs,
                { autor: "suporte", texto: "⚠ Erro ao conectar com o servidor." }
            ]);
        }

        setCarregando(false);
    }, [texto, carregando]);

    const handleEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            enviarMensagem();
        }
    };

    return (
        <div
            className="d-flex flex-column bg-white"
            style={{
                height: "100%",
                width: "100%",
                borderRadius: "10px",
                overflow: "hidden"
            }}
        >

            {/* 🔵 Cabeçalho compactado para usar no widget */}
            <div
                className="text-white d-flex align-items-center px-3"
                style={{
                    background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)",
                    minHeight: "55px",
                    fontSize: "15px",
                    gap: "10px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
                }}
            >
                <img src="/img/gm.svg" alt="Logo GM" height="26" />
                <span className="fw-bold">Suporte GM</span>
            </div>

            {/* 🔥 Perguntas rápidas */}
            <div
                className="d-flex gap-2 flex-wrap p-2 border-bottom"
                style={{ background: "var(--background-color)" }}
            >
                {perguntasRapidas.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => enviarMensagem(p)}
                        className="btn btn-sm text-dark"
                        style={{
                            background: "var(--user-bubble)",
                            borderRadius: "20px",
                            padding: "6px 14px",
                            border: "1px solid #d1d1d1"
                        }}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* 🗨 Área das mensagens */}
            <div
                className="overflow-auto p-3 d-flex flex-column chat-messages"
                style={{ flexGrow: 1, background: "#fff" }}
            >
                {mensagens.length === 0 && (
                    <div className="text-center text-muted mt-5">
                        👋 Olá! Como posso ajudar hoje?
                    </div>
                )}

                {mensagens.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-2 px-3 rounded-4 mb-2 ${msg.autor === "usuario"
                                ? "align-self-end text-white"
                                : "align-self-start text-dark"
                            }`}
                        style={{
                            background:
                                msg.autor === "usuario"
                                    ? "var(--primary-color)"
                                    : "var(--user-bubble)",
                            maxWidth: "75%",
                            wordWrap: "break-word",
                        }}
                    >
                        {msg.texto}
                    </div>
                ))}

                {/* Indicador de digitando */}
                {carregando && (
                    <div
                        className="align-self-start text-dark p-2 px-3 rounded-4 mb-2"
                        style={{
                            background: "var(--user-bubble)",
                            fontStyle: "italic",
                            opacity: 0.7
                        }}
                    >
                        Digitando...
                    </div>
                )}

                {/* 🔽 Marcador para scroll automático */}
                <div ref={messagesEndRef}></div>
            </div>


            {/* 💬 Input */}
            <div className="d-flex border-top p-2 bg-white">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Digite sua mensagem..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={handleEnter}
                    disabled={carregando}
                />
                <button
                    className="btn text-white fw-semibold rounded-pill"
                    onClick={() => enviarMensagem()}
                    disabled={carregando}
                    style={{ backgroundColor: "var(--primary-color)" }}
                >
                    {carregando ? "Enviando..." : "Enviar"}
                </button>
            </div>
        </div>
    );
}
