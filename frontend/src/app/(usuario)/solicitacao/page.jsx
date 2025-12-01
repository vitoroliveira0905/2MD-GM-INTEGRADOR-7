"use client";


import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

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
    const [redirecionando, setRedirecionando] = useState(false);
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
            if (dados.usuario.tipo === "admin") {
                router.push("/administracao/dashboard");
                return;
            }
            setDadosUsuario(dados);

            fetch("http://localhost:3001/api/produtos?pagina=1&limite=100", {
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
                // Inicia uma transição suave e redireciona para a página do usuário
                setRedirecionando(true);
                // Dá um pequeno tempo para o usuário ver o feedback e a animação
                setTimeout(() => {
                    setMensagem("");
                    router.push("/");
                }, 1200);
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
        <main
            className={`solicitacao-main ${redirecionando ? "page-fade-out" : ""}`}
        >
            <div className="container">
                {mensagem && (
                    <div
                        className={`position-fixed top-0 start-50 translate-middle-x mt-3 alert ${mensagem.includes("sucesso") ? "alert-success" : "alert-danger"} shadow-lg`}
                        role="alert"
                        style={{ zIndex: 1055, minWidth: "300px", borderRadius: "12px" }}
                    >
                        {mensagem}
                    </div>
                )}

                <div className="form-card">
                    <div className="text-center mb-5">
                        <h1 className="fw-bold gradient-title mb-2" style={{ fontSize: "clamp(28px, 5vw, 42px)" }}>
                            <i className="bi bi-pencil-square me-3"></i>
                            Nova Solicitação
                        </h1>
                        <p className="text-muted fs-5">Preencha os dados abaixo para solicitar o material</p>
                    </div>

                    <form onSubmit={adicionarSolicitacao}>
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary mb-2">
                                    <i className="bi bi-box-seam me-2" style={{ color: "var(--primary-color)" }}></i>
                                    Material
                                </label>
                                <div className="input-group">
                                    <span className="modern-icon-wrapper rounded-start">
                                        <i className="bi bi-box-seam"></i>
                                    </span>
                                    <Select
                                        className="flex-grow-1 select-material"
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                border: "none",
                                                borderBottom: "2px solid #dee2e6",
                                                borderRadius: 0,
                                                boxShadow: "none",
                                                minHeight: "50px",
                                                "&:hover": {
                                                    borderBottom: "2px solid var(--primary-color)"
                                                }
                                            }),
                                            valueContainer: (base) => ({
                                                ...base,
                                                padding: "12px 16px"
                                            })
                                        }}
                                        placeholder="Selecione um material..."
                                        options={produtos.dados.map(p => ({ value: p.id, label: p.nome }))}
                                        onChange={(item) =>
                                            setSolicitacao({ ...solicitacao, produto: item.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary mb-2">
                                    <i className="bi bi-123 me-2" style={{ color: "var(--primary-color)" }}></i>
                                    Quantidade
                                </label>
                                <div className="input-group">
                                    <span className="modern-icon-wrapper rounded-start">
                                        <i className="bi bi-123"></i>
                                    </span>
                                    <input
                                        type="number"
                                        className="form-control modern-input rounded-end"
                                        placeholder="Digite a quantidade"
                                        value={solicitacao.quantidade}
                                        onChange={(e) =>
                                            setSolicitacao({ ...solicitacao, quantidade: Number(e.target.value) })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary mb-2">
                                    <i className="bi bi-shop me-2" style={{ color: "var(--primary-color)" }}></i>
                                    Shop
                                </label>
                                <div className="input-group">
                                    <span className="modern-icon-wrapper rounded-start">
                                        <i className="bi bi-shop"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control modern-input rounded-end"
                                        placeholder="Ex: GA, Ferramentaria..."
                                        value={solicitacao.shop}
                                        onChange={(e) =>
                                            setSolicitacao({ ...solicitacao, shop: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold text-secondary mb-2">
                                    <i className="bi bi-geo-alt me-2" style={{ color: "var(--primary-color)" }}></i>
                                    Área
                                </label>
                                <div className="input-group">
                                    <span className="modern-icon-wrapper rounded-start">
                                        <i className="bi bi-geo-alt"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control modern-input rounded-end"
                                        placeholder="Ex: Mec1, Tap1..."
                                        value={solicitacao.area}
                                        onChange={(e) =>
                                            setSolicitacao({ ...solicitacao, area: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-semibold text-secondary mb-2">
                                    <i className="bi bi-chat-text me-2" style={{ color: "var(--primary-color)" }}></i>
                                    Descrição
                                </label>
                                <textarea
                                    className="form-control modern-textarea w-100"
                                    placeholder="Descreva os detalhes da sua solicitação..."
                                    value={solicitacao.descricao}
                                    onChange={(e) =>
                                        setSolicitacao({ ...solicitacao, descricao: e.target.value })
                                    }
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-3 justify-content-end mt-5">
                            <button
                                type="button"
                                className="btn btn-lg px-5 fw-semibold shadow-sm btn-cancelar"
                                onClick={() => router.back()}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                className="btn btn-lg px-5 fw-bold shadow-sm btn-enviar"
                                disabled={carregando}
                            >
                                {carregando ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-send-fill me-2"></i>
                                        Enviar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
