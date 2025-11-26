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
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const estoqueResp = await estRes.json();
                const estoque = estoqueResp.dados || [];

                setMovimentacoes(estoque.length);
                setCriticos(estoque.filter((item) => item.quantidade < item.minimo).length);
                setEsgotados(estoque.filter((item) => item.quantidade === 0).length);
                setEstoques(estoque.filter((item) => item.quantidade > item.minimo).length);


                const solRes = await fetch("http://localhost:3001/api/solicitacoes", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
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
        <div className="container py-5 ">
            <div className="mb-4">
                <button
                    className="btn btn-outline-dark fw-semibold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    style={{ borderRadius: "12px" }}
                    onClick={() => router.back()}
                >
                    <i className="bi bi-arrow-left"></i> Voltar
                </button>
            </div>

            <h1
                className="text-center mb-5 fw-bold"
                style={{ color: "var(--primary-color)" }}
            >
                <i className="bi bi-graph-up-arrow me-2"></i> Relatórios
            </h1>

            <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: "16px" }}>
                <h5 className="fw-bold mb-3">
                    <i className="bi bi-funnel me-2"></i>Selecione o tipo de relatório
                </h5>

                <select
                    className="form-select w-50"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="estoque">Movimentações do Estoque</option>
                    <option value="solicitacoes">Solicitações (Aprovadas / Recusadas)</option>
                </select>
            </div>

            <div className="card shadow-lg p-4" style={{ borderRadius: "20px" }}>
                <h4 className="fw-bold mb-4">
                    <i className="bi bi-file-text me-2"></i>Resumo Rápido
                </h4>

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
                                "rgba(155, 89, 182, 0.65)"
                                ,
                                "rgba(255, 206, 86, 0.65)",
                                "rgba(46, 204, 113, 0.65)",
                                "rgba(255, 99, 132, 0.65)",
                                "rgba(54, 162, 235, 0.65)"
                                 , "rgba(149, 165, 166, 0.65)"]
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



    );
}
