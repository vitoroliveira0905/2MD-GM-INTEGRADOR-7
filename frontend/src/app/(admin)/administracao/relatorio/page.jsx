"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRouter } from "next/navigation";
import GraficoPro from "@/components/GraficoPro/page";
export default function Relatorios() {
    const router = useRouter();
    const [tipo, setTipo] = useState("estoque");
    const [movimentacoes, setMovimentacoes] = useState(0);
    const [criticos, setCriticos] = useState(0);
    const [esgotados, setEsgotados] = useState(0);
    const [estoques, setEstoques] = useState(0);
    const [totalSolicitacoes, setTotalSolicitacoes] = useState(0);
    const [pendentes, setPendentes] = useState(0);
    const [aprovadas, setAprovadas] = useState(0);
    const [recusadas, setRecusadas] = useState(0);
    const [finalizadas, setFinalizadas] = useState(0);
    const [canceladas, setCanceladas] = useState(0);
    const [dadosUsuario, setDadosUsuario] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("dadosUsuario"));
        if (!user) return router.push("/login");
        setDadosUsuario(user);
        async function carregarDados() {
            try {
                const estRes = await fetch("http://localhost:3001/api/produtos", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const estoqueResp = await estRes.json();
                const estoque = estoqueResp.dados || [];
                setMovimentacoes(estoque.length);
                setCriticos(estoque.filter((item) => item.quantidade < item.minimo).length);
                setEsgotados(estoque.filter((item) => item.quantidade === 0).length);
                setEstoques(estoque.filter((item) => item.quantidade > item.minimo).length);

                const solRes = await fetch("http://localhost:3001/api/solicitacoes", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const solResp = await solRes.json();
                const solicitacoes = solResp.solicitacoes || [];
                setTotalSolicitacoes(solicitacoes.length);
                setPendentes(solicitacoes.filter((s) => s.status === "pendente").length);
                setAprovadas(solicitacoes.filter((s) => s.status === "aprovado").length);
                setRecusadas(solicitacoes.filter((s) => s.status === "recusado").length);
                setFinalizadas(solicitacoes.filter((s) => s.status === "finalizado").length);
                setCanceladas(solicitacoes.filter((s) => s.status === "cancelado").length);
            } catch (error) {
                console.log("Erro ao carregar relatórios:", error);
            }
        }
        carregarDados();
    }, []);

    if (!dadosUsuario) return <p>Carregando...</p>;

    return (
        <main style={{ background: "#f8f9fa", minHeight: "100vh" }}>
            <div className="container py-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                        <h1 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>
                            <i className="bi bi-bar-chart-line-fill me-2"></i> Relatórios
                        </h1>
                        <p className="text-muted mb-0">Visualize o resumo do estoque e das solicitações do sistema.</p>
                    </div>
                </div>

                <div className="row g-3 mb-4">
                    <div className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-primary-subtle rounded-3 p-3 me-3">
                                    <i className="bi bi-box-seam fs-2 text-primary"></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Movimentações Estoque</p>
                                    <h3 className="mb-0 fw-bold">{movimentacoes}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-warning-subtle rounded-3 p-3 me-3">
                                    <i className="bi bi-exclamation-triangle fs-2 text-warning"></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Itens Críticos</p>
                                    <h3 className="mb-0 fw-bold">{criticos}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="card border-0 shadow-sm h-100 stats-card">
                            <div className="card-body d-flex align-items-center">
                                <div className="icon-wrapper bg-danger-subtle rounded-3 p-3 me-3">
                                    <i className="bi bi-x-circle fs-2 text-danger"></i>
                                </div>
                                <div>
                                    <p className="text-muted mb-1 small">Esgotados</p>
                                    <h3 className="mb-0 fw-bold">{esgotados}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-5 col-lg-4">
                        <label className="fw-semibold mb-2" htmlFor="tipoRelatorio">
                            <i className="bi bi-funnel me-2"></i>Tipo de Relatório
                        </label>
                        <select
                            id="tipoRelatorio"
                            className="form-select form-select-lg modern-input"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                        >
                            <option value="estoque">Movimentações do Estoque</option>
                            <option value="solicitacoes">Solicitações (Aprovadas / Recusadas)</option>
                        </select>
                    </div>
                </div>

                <div className="card border-0 shadow rounded-4 overflow-hidden mb-4">
                    <div className="card-header bg-white py-3 px-4 d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-bar-graph text-primary"></i>
                        <span className="fw-semibold">Resumo Rápido</span>
                    </div>
                    <div className="card-body">
                        <ul className="list-group mb-4">
                            {tipo === "estoque" && (
                                <>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Total de movimentações:</span>
                                        <strong>{movimentacoes}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Itens em nível crítico:</span>
                                        <strong>{criticos}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Itens sem estoque:</span>
                                        <strong>{esgotados}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Itens em estoque:</span>
                                        <strong>{estoques}</strong>
                                    </li>
                                </>
                            )}
                            {tipo === "solicitacoes" && (
                                <>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Total de solicitações:</span>
                                        <strong>{totalSolicitacoes}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Solicitações pendentes:</span>
                                        <strong>{pendentes}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Solicitações aprovadas:</span>
                                        <strong>{aprovadas}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Solicitações recusadas:</span>
                                        <strong>{recusadas}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Solicitações finalizadas:</span>
                                        <strong>{finalizadas}</strong>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Solicitações canceladas:</span>
                                        <strong>{canceladas}</strong>
                                    </li>
                                </>
                            )}
                        </ul>
                        <p className="text-secondary text-center">Resumo de dados atualizados.</p>
                    </div>
                </div>

                <div className="mt-5">
                    {["estoque", "solicitacoes"].map((graficoTipo) => {
                        if (tipo !== graficoTipo) return null;
                        const config = {
                            estoque: {
                                titulo: "Situação do Estoque",
                                labels: ["Movimentações", "Críticos", "Esgotados", "Estoque OK"],
                                valores: [movimentacoes, criticos, esgotados, estoques],
                                cores: [
                                    "rgba(54, 162, 235, 0.65)",
                                    "rgba(255, 206, 86, 0.65)",
                                    "rgba(255, 99, 132, 0.65)",
                                    "rgba(46, 204, 113, 0.65)"
                                ]
                            },
                            solicitacoes: {
                                titulo: "Status das Solicitações",
                                labels: ["Total", "Pendentes", "Aprovadas", "Recusadas", "Finalizadas", "Canceladas"],
                                valores: [totalSolicitacoes, pendentes, aprovadas, recusadas, finalizadas, canceladas],
                                cores: [
                                    "rgba(155, 89, 182, 0.65)",
                                    "rgba(255, 206, 86, 0.65)",
                                    "rgba(46, 204, 113, 0.65)",
                                    "rgba(255, 99, 132, 0.65)",
                                    "rgba(54, 162, 235, 0.65)",
                                    "rgba(149, 165, 166, 0.65)"
                                ]
                            },
                        };
                        return (
                            <div key={graficoTipo} className="mb-4" style={{ transition: "all 0.5s ease" }}>
                                <GraficoPro
                                    titulo={config[graficoTipo].titulo}
                                    tipo="bar"
                                    labels={config[graficoTipo].labels}
                                    valores={config[graficoTipo].valores}
                                    cores={config[graficoTipo].cores}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
