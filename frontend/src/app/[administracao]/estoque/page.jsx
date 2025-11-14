"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PainelEstoque() {
    const [materiais, setMateriais] = useState([
        { id: 1, nome: "Cabo UTP", quantidade: 30, minimo: 10 },
        { id: 2, nome: "Conector RJ-45", quantidade: 5, minimo: 20 },
        { id: 3, nome: "Switch 8 portas", quantidade: 0, minimo: 2 },
    ]);
    const router = useRouter()
    const [busca, setBusca] = useState("");

    const [editando, setEditando] = useState(null);
    const [novoNome, setNovoNome] = useState("");
    const [novoQtd, setNovoQtd] = useState("");
    const [novoMin, setNovoMin] = useState("");


    const [criando, setCriando] = useState(false);
    const [nomeNovoItem, setNomeNovoItem] = useState("");
    const [qtdNovoItem, setQtdNovoItem] = useState("");
    const [minNovoItem, setMinNovoItem] = useState("");


    const abrirEdicao = (item) => {
        setEditando(item.id);
        setNovoNome(item.nome);
        setNovoQtd(item.quantidade);
        setNovoMin(item.minimo);
    };


    const salvarEdicao = () => {
        setMateriais((materiais) =>
            materiais.map((m) =>
                m.id === editando
                    ? { ...m, nome: novoNome, quantidade: Number(novoQtd), minimo: Number(novoMin) }
                    : m
            )
        );
        setEditando(null);
    };


    const excluirMaterial = (id) => {
        if (confirm("Tem certeza que deseja excluir?")) {
            setMateriais((materiais) => materiais.filter((m) => m.id !== id));
        }
    };

    const criarMaterial = () => {
        const novo = {
            id: materiais.length + 1,
            nome: nomeNovoItem,
            quantidade: Number(qtdNovoItem),
            minimo: Number(minNovoItem),
        };

        setMateriais([...materiais, novo]);

        setCriando(false);
        setNomeNovoItem("");
        setQtdNovoItem("");
        setMinNovoItem("");
    };

    const filtrar = materiais.filter((m) =>
        m.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="container py-5">

            <div className="mb-4">
                <button
                    className="btn btn-outline-dark fw-semibold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
                    style={{ borderRadius: "12px" }}
                    onClick={() => router.back()}
                >
                    <i className="bi bi-arrow-left"></i> Voltar
                </button>
            </div>
            <h1 className="text-center mb-4 fw-bold" style={{ color: "var(--primary-color)" }}>
                <i className="bi bi-box me-2"></i> Estoque De Materiais
            </h1>


            <div className="row text-center mb-4">
                <div className="col-md-4 mb-3">
                    <div className="p-3 rounded shadow-sm bg-light">
                        <i className="bi bi-box-seam fs-2"></i>
                        <h5 className="mt-2">Total de Itens</h5>
                        <span className="fs-4 fw-bold">{materiais.length}</span>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="p-3 rounded shadow-sm bg-light">
                        <i className="bi bi-exclamation-triangle text-warning fs-2"></i>
                        <h5 className="mt-2">Baixo Estoque</h5>
                        <span className="fs-4 fw-bold">
                            {materiais.filter((m) => m.quantidade <= m.minimo && m.quantidade > 0).length}
                        </span>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="p-3 rounded shadow-sm bg-light">
                        <i className="bi bi-x-circle text-danger fs-2"></i>
                        <h5 className="mt-2">Esgotado</h5>
                        <span className="fs-4 fw-bold">
                            {materiais.filter((m) => m.quantidade === 0).length}
                        </span>
                    </div>
                </div>
            </div>


            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    placeholder="Buscar material..."
                    className="form-control w-50"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <button
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() => setCriando(true)}
                >
                    <i className="bi bi-plus-circle"></i>
                    Adicionar Material
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Material</th>
                            <th>Quantidade</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrar.map((item) => {
                            let status = "";
                            if (item.quantidade === 0) status = "Zerado";
                            else if (item.quantidade <= item.minimo) status = "Baixo";
                            else status = "OK";

                            return (
                                <tr key={item.id}>
                                    <td>{item.nome}</td>
                                    <td>{item.quantidade}</td>
                                    <td>
                                        {status === "OK" && <span className="badge bg-success">Em estoque</span>}
                                        {status === "Baixo" && (
                                            <span className="badge bg-warning text-dark">Baixo</span>
                                        )}
                                        {status === "Zerado" && (
                                            <span className="badge bg-danger">Zerado</span>
                                        )}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => abrirEdicao(item)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => excluirMaterial(item.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


            {editando && (
                <div
                    className="modal fade show d-block"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Material</h5>
                            </div>

                            <div className="modal-body">
                                <label className="form-label">Nome</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={novoNome}
                                    onChange={(e) => setNovoNome(e.target.value)}
                                />

                                <label className="form-label">Quantidade</label>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    value={novoQtd}
                                    onChange={(e) => setNovoQtd(e.target.value)}
                                />

                                <label className="form-label">Mínimo</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={novoMin}
                                    onChange={(e) => setNovoMin(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditando(null)}>
                                    Cancelar
                                </button>

                                <button className="btn btn-primary" onClick={salvarEdicao}>
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {criando && (
                <div
                    className="modal fade show d-block"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Adicionar Material</h5>
                            </div>

                            <div className="modal-body">
                                <label className="form-label">Nome</label>
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    value={nomeNovoItem}
                                    onChange={(e) => setNomeNovoItem(e.target.value)}
                                />

                                <label className="form-label">Quantidade</label>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    value={qtdNovoItem}
                                    onChange={(e) => setQtdNovoItem(e.target.value)}
                                />

                                <label className="form-label">Mínimo</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={minNovoItem}
                                    onChange={(e) => setMinNovoItem(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setCriando(false)}>
                                    Cancelar
                                </button>

                                <button className="btn btn-success" onClick={criarMaterial}>
                                    Adicionar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
