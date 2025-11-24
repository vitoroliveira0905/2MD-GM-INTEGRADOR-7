"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Solicitacao() {
    const router = useRouter();

    const [solicitacao, setSolicitacao] = useState({
        produto: "",
        quantidade: "",
        descricao: "",
        shop: "",
        area: ""
    });

    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [dadosUsuario, setDadosUsuario] = useState(null);
    const [produtos, setProdutos] = useState([]);

    // Carregar dados do usuário e produtos ao montar o componente
    useEffect(() => {
        const dadosString = localStorage.getItem("dadosUsuario");
        if (!dadosString) {
            router.push("/login");
            return;
        }
        try {
            const dados = JSON.parse(dadosString);
            if (!dados?.usuario?.tipo || dados.usuario.tipo !== "comum") {
                router.push(dados.usuario?.tipo === "comum" ? "/login" : "/admin/dashboard");
                return;
            }
            setDadosUsuario(dados);

            fetch("http://localhost:3001/api/produtos", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${dados.token}`,
                }
            })
                .then(response => response.json())
                .then(data => setProdutos(data))
                .catch(error => console.error("Erro ao buscar produtos:", error));
        } catch (e) {
            console.error("Erro ao parsear dadosUsuario do localStorage:", e);
            router.push("/login");
        }
    }, [])

    // Função para adicionar uma nova solicitação
    const adicionarSolicitacao = async (e) => {
        e.preventDefault();

        if (solicitacao.quantidade <= 0) {
            setMensagem("A quantidade deve ser maior que zero.");
            return;
        }

        setCarregando(true);
        try {
            const resposta = await fetch("http://localhost:3001/api/solicitacoes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${dadosUsuario.token}`,
                },
                body: JSON.stringify({
                    usuario_id: dadosUsuario.usuario.id,
                    produto_id: solicitacao.produto,
                    quantidade: solicitacao.quantidade,
                    shop: solicitacao.shop,
                    area: solicitacao.area,
                    descricao: solicitacao.descricao,
                }),
            });

            if (resposta.ok) {
                setMensagem("Solicitação enviada com sucesso!");
                setSolicitacao({
                    produto: "",
                    quantidade: "",
                    descricao: "",
                    shop: "",
                    area: ""
                });
                setTimeout(() => setMensagem(""), 4000);
            } else {
                setMensagem("Erro ao enviar solicitação. Tente novamente.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            setMensagem("Falha na conexão com o servidor.");
        } finally {
            setCarregando(false);
        }
    };

    if (dadosUsuario === null || dadosUsuario.usuario.tipo !== "comum" || produtos.length === 0) {
        return <p>Carregando...</p>
    }

    return (
        <div className="container my-5">

            <div className="mb-4">
                <button
                    className="btn btn-outline-dark fw-bold px-4 py-2 d-flex align-items-center gap-2"
                    style={{ borderRadius: "10px", borderWidth: "2px" }}
                    onClick={() => router.back()}
                >
                    <i className="bi bi-arrow-left"></i> Voltar
                </button>
            </div>


            <h1
                className="text-center my-4 fw-bold"
                style={{ color: "var(--primary-color)" }}
            >
                <i className="bi bi-pencil-square me-2"></i> Faça sua solicitação
            </h1>


            {mensagem && (
                <div
                    className={`position-fixed top-0 start-50 translate-middle-x mt-3 alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-danger"
                        } shadow`}
                    role="alert"
                    style={{ zIndex: 1055, minWidth: "300px" }}
                >
                    {mensagem}
                </div>
            )}


            <form
                onSubmit={adicionarSolicitacao}
                className="row g-3 mt-4 bg-light p-4 rounded shadow-sm"
            >
                <div className="col-md-6">
                    <div className="input-group input-group-lg" style={{ padding: "0 !important" }}>
                        <span className="input-group-text">
                            <i className="bi bi-box-seam"></i>
                        </span>
                        {/*<input
                            type="text"
                            className="form-control"
                            placeholder="Nome do produto"
                            value={solicitacao.produto}
                            onChange={(e) =>
                                setSolicitacao({ ...solicitacao, produto: e.target.value })
                            }
                            required
                        />*/}
                        <Select
                            className="form-control"
                            options={produtos.dados.map(p => ({ value: p.id, label: p.nome }))}
                            onChange={(item) =>
                                setSolicitacao({ ...solicitacao, produto: item.value })
                            }
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text">
                            <i className="bi bi-123"></i>
                        </span>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Quantidade"
                            value={solicitacao.quantidade}
                            onChange={(e) =>
                                setSolicitacao({ ...solicitacao, quantidade: Number(e.target.value) })
                            }
                            required
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text">
                            <i className="bi bi-shop"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Shop (ex: GA, Ferramentaria...)"
                            value={solicitacao.shop}
                            onChange={(e) =>
                                setSolicitacao({ ...solicitacao, shop: e.target.value })
                            }
                            required
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text">
                            <i className="bi bi-geo-alt"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Área (ex: Mec1, Tap1...)"
                            value={solicitacao.area}
                            onChange={(e) =>
                                setSolicitacao({ ...solicitacao, area: e.target.value })
                            }
                            required
                        />
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text">
                            <i className="bi bi-flag"></i>
                        </span>
                        <select
                            className="form-select"

                            required
                        >
                            <option value="">Selecione a prioridade</option>
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>
                </div>

                <div className="col-12">
                    <div className="input-group input-group-lg">
                        <span className="input-group-text">
                            <i className="bi bi-chat-text"></i>
                        </span>
                        <textarea
                            className="form-control"
                            placeholder="Descrição"
                            value={solicitacao.descricao}
                            onChange={(e) =>
                                setSolicitacao({ ...solicitacao, descricao: e.target.value })
                            }
                            rows={3}
                            required
                        />
                    </div>
                </div>

                <div className="col-12 text-center">
                    <button
                        type="submit"
                        className="btn btn-lg mt-3 px-5 fw-bold d-flex align-items-center justify-content-center gap-2"
                        style={{
                            background: "var(--primary-color)",
                            color: "white",
                            borderRadius: "8px",
                        }}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                ></span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-send-fill"></i> Enviar Solicitação
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
