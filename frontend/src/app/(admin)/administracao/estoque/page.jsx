"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";
import ModalMaterial from "@/components/ModalMaterial";
import ModalExcluir from "@/components/ModalExcluir";
import ToastNotification from "@/components/ToastNotification";
import "@/components/ToastNotification/styles.css";


export default function PainelEstoque() {
    /*const [produtos, setProdutos] = useState([
        { id: 1, nome: "Cabo UTP", quantidade: 30, minimo_estoque: 10 },
        { id: 2, nome: "Conector RJ-45", quantidade: 5, minimo_estoque: 20 },
        { id: 3, nome: "Switch 8 portas", quantidade: 0, minimo_estoque: 2 },
    ]);*/


    const router = useRouter()
    const [busca, setBusca] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("todos");

    const [modalAberto, setModalAberto] = useState(false);
    const [materialEditando, setMaterialEditando] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [materialExcluindo, setMaterialExcluindo] = useState(null);

    const [dadosUsuario, setDadosUsuario] = useState(null);
    // garantir que produtos tenha a forma { dados: [] } para evitar erros ao acessar produtos.dados
    const [produtos, setProdutos] = useState({ dados: [] });
    const [notificacoes, setNotificacoes] = useState([]);

    const pushNotificacao = (tipo, texto, tempo = 3000) => {
        const id = Date.now() + Math.random();
        setNotificacoes((prev) => [...prev, { id, tipo, texto }]);
        if (tempo > 0) {
            setTimeout(() => {
                setNotificacoes((prev) => prev.filter((n) => n.id !== id));
            }, tempo);
        }
    };

    useEffect(() => {
        const dadosString = localStorage.getItem("dadosUsuario");
        if (!dadosString) {
            router.push("/login");
            return;
        }
        try {
            const dados = JSON.parse(dadosString);
            if (dados.usuario.tipo === "comum") {
                router.push("/");
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
                .then(data => {
                    setProdutos(data);
                    
                })
                .catch(error => {
                    console.error("Erro ao buscar produtos:", error);
                    pushNotificacao('error', 'Erro ao carregar produtos.');
                });
        } catch (e) {
            console.error("Erro ao parsear dadosUsuario do localStorage:", e);
            router.push("/login");
        }
    }, [])

    if (dadosUsuario === null || dadosUsuario.usuario.tipo !== "admin" || produtos === null) {
        return <p>Carregando...</p>
    }

    const abrirModalEdicao = (item) => {
        setMaterialEditando(item);
        setIsEdit(true);
        setModalAberto(true);
    };

    const abrirModalCriacao = () => {
        setMaterialEditando(null);
        setIsEdit(false);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setMaterialEditando(null);
    };

    const salvarMaterial = async (dadosMaterial) => {
        if (isEdit && materialEditando) {
            // Editar material existente
            const payload = {
                ...dadosMaterial,
            };

            try {
                const resp = await fetch(`http://localhost:3001/api/produtos/${materialEditando.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${dadosUsuario?.token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!resp.ok) {
                    console.error("Falha ao atualizar produto", await resp.text());
                    pushNotificacao('error', 'Falha ao atualizar material. Verifique os dados.');
                    return;
                }

                const atualizado = await resp.json();
                const prod = atualizado?.produto || atualizado;

                setProdutos((prev) => ({
                    ...prev,
                    dados: prev.dados.map((m) =>
                        m.id === materialEditando.id
                            ? {
                                ...m,
                                nome: prod.nome ?? payload.nome,
                                quantidade: prod.quantidade ?? payload.quantidade,
                                minimo_estoque: prod.minimo_estoque ?? payload.minimo_estoque,
                                categoria: prod.categoria ?? payload.categoria,
                            }
                            : m
                    ),
                }));
                fecharModal();
                pushNotificacao('success', `Material "${prod.nome || payload.nome}" atualizado com sucesso.`);
            } catch (e) {
                console.error("Erro ao enviar atualização de produto:", e);
                pushNotificacao('error', 'Erro ao atualizar material. Tente novamente.');
            }
        } else {
            // Criar novo material
            const payload = {
                ...dadosMaterial,
                preco: 1,
            };

            try {
                const resp = await fetch('http://localhost:3001/api/produtos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${dadosUsuario?.token}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!resp.ok) {
                    const texto = await resp.text();
                    console.error('Falha ao criar produto:', texto);
                    pushNotificacao('error', 'Não foi possível criar o produto. Verifique os dados.');
                    return;
                }

                const resultado = await resp.json();
                const criado = resultado?.dados || resultado;
                const novo = {
                    id: criado.id,
                    nome: payload.nome,
                    quantidade: payload.quantidade,
                    minimo_estoque: payload.minimo_estoque,
                    categoria: payload.categoria,
                };

                setProdutos((prev) => ({ ...prev, dados: [...prev.dados, novo] }));
                fecharModal();
                pushNotificacao('success', `Material "${payload.nome}" criado com sucesso.`);
            } catch (e) {
                console.error('Erro na requisição de criação:', e);
                pushNotificacao('error', 'Erro ao conectar com o servidor.');
            }
        }
    };


    const abrirModalExclusao = (material) => {
        setMaterialExcluindo(material);
        setModalExcluirAberto(true);
    };

    const fecharModalExclusao = () => {
        setModalExcluirAberto(false);
        setMaterialExcluindo(null);
    };

    const confirmarExclusao = async () => {
        if (!materialExcluindo) return;
        
        try {
            const resp = await fetch(`http://localhost:3001/api/produtos/${materialExcluindo.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${dadosUsuario?.token}`,
                },
            });

            if (!resp.ok) {
                if (resp.status === 409) {
                    const msg = await resp.json().catch(() => null);
                    pushNotificacao('warn', msg?.mensagem || "Não é possível excluir: existem solicitações vinculadas a este material.", 5000);
                    fecharModalExclusao();
                    return;
                }
                console.error("Falha ao excluir produto:", await resp.text());
                pushNotificacao('error', 'Falha ao excluir material. Tente novamente.');
                fecharModalExclusao();
                return;
            }

            setProdutos((prev) => ({ ...prev, dados: prev.dados.filter((m) => m.id !== materialExcluindo.id) }));
            fecharModalExclusao();
            pushNotificacao('success', `Material "${materialExcluindo.nome}" excluído com sucesso.`);
        } catch (e) {
            console.error("Erro na requisição de exclusão:", e);
            pushNotificacao('error', 'Erro ao excluir material. Tente novamente.');
        }
    };

    const filtrar = produtos.dados.filter((m) => {
        const matchBusca = m.nome.toLowerCase().includes(busca.toLowerCase()) || 
                          m.id.toString().includes(busca);
        const matchCategoria = filtroCategoria === "todos" || m.categoria === filtroCategoria;
        return matchBusca && matchCategoria;
    });

    // Obter categorias únicas para o filtro
    const categorias = [...new Set(produtos.dados.map(p => p.categoria).filter(Boolean))];

    return (
        <main style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="container py-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>
                            <i className="bi bi-box me-2"></i> Estoque de Materiais
                        </h1>
                        <p className="text-muted mb-0">Gerencie o estoque de materiais e produtos.</p>
                    </div>
                    <div className="d-none d-md-flex align-items-center gap-2">
                        <span className="badge rounded-pill bg-primary-subtle text-primary">
                            <i className="bi bi-box-seam me-2"></i>
                            {produtos.dados.length} produto(s)
                        </span>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-primary-subtle rounded-3 p-3 me-3">
                                    <i className="bi bi-box-seam fs-2 text-primary"></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Total de Itens</p>
                                    <h3 className="mb-0 fw-bold">{produtos.dados.length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-warning-subtle rounded-3 p-3 me-3">
                                    <i className="bi bi-exclamation-triangle fs-2 text-warning"></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Baixo Estoque</p>
                                    <h3 className="mb-0 fw-bold">
                                        {produtos.dados.filter((m) => m.quantidade <= m.minimo_estoque && m.quantidade > 0).length}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-danger-subtle rounded-3 p-3 me-3">
                                    <i className="bi bi-x-circle fs-2 text-danger"></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Esgotado</p>
                                    <h3 className="mb-0 fw-bold">
                                        {produtos.dados.filter((m) => m.quantidade === 0).length}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row mb-4">
                    <div className="col-md-4">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou ID..."
                            className="form-control form-control-lg modern-input"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select form-select-lg modern-input"
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                            <option value="todos">Todas as Categorias</option>
                            {categorias.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-5 text-end">
                        <button
                            className="btn btn-success d-flex align-items-center gap-2 ms-auto"
                            onClick={abrirModalCriacao}
                        >
                            <i className="bi bi-plus-circle"></i>
                            Adicionar Material
                        </button>
                    </div>
                </div>

                <div className="card border-0 shadow rounded-4 overflow-hidden">
                    <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-table text-primary"></i>
                            <span className="fw-semibold">Materiais em Estoque</span>
                        </div>
                        <div className="text-muted small">
                            Última atualização em {new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "")}
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-gradient">
                                <tr>
                                    <th scope="col" className="fw-semibold table-gradient">ID</th>
                                    <th scope="col" className="fw-semibold table-gradient">Material</th>    
                                    <th scope="col" className="fw-semibold table-gradient">Categoria</th>
                                    <th scope="col" className="fw-semibold table-gradient">Quantidade</th>
                                    <th scope="col" className="fw-semibold table-gradient">Mínimo</th>
                                    <th scope="col" className="text-center fw-semibold table-gradient">Status</th>
                                    <th scope="col" className="text-end fw-semibold table-gradient">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrar.map((item) => {
                                    let status = "";
                                    if (item.quantidade === 0) status = "Zerado";
                                    else if (item.quantidade <= item.minimo_estoque) status = "Baixo";
                                    else status = "OK";

                                    return (
                                        <tr key={item.id}>
                                            <td className="p-3">{item.id}</td>
                                            <td className="p-3">{item.nome}</td>
                                          
                                            <td className="p-3">{item.categoria || '-'}</td>
                                            <td className="p-3">{item.quantidade}</td>
                                            <td className="p-3">{item.minimo_estoque}</td>
                                            <td className="text-center p-3">
                                                {status === "OK" && <span className="badge-status badge-success">EM ESTOQUE</span>}
                                                {status === "Baixo" && (
                                                    <span className="badge-status badge-warning">BAIXO</span>
                                                )}
                                                {status === "Zerado" && (
                                                    <span className="badge-status badge-danger">ESGOTADO</span>
                                                )}
                                            </td>

                                            <td className="text-end p-3">
                                                <div className="d-inline-flex gap-2 align-items-center">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => abrirModalEdicao(item)}
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => abrirModalExclusao(item)}
                                                        title="Excluir"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {modalAberto && (
                    <ModalMaterial
                        material={materialEditando}
                        onClose={fecharModal}
                        onConfirm={salvarMaterial}
                        isEdit={isEdit}
                    />
                )}

                {modalExcluirAberto && (
                    <ModalExcluir
                        material={materialExcluindo}
                        onClose={fecharModalExclusao}
                        onConfirm={confirmarExclusao}
                    />
                )}

                <ToastNotification
                    notificacoes={notificacoes}
                    onClose={(id) => setNotificacoes((prev) => prev.filter((n) => n.id !== id))}
                />
            </div>
        </main>
    );
}
