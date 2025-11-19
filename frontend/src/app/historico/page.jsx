"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Historico() {
  const router = useRouter();
  const [dadosSolicitacoes, setDadosSolicitacoes] = useState(null);
  const [dadosUsuario, setDadosUsuario] = useState(null);

  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(null);

  function verDetalhes(item) {
    setModalDetalhes(item);
  }

  function cancelarSolicitacao(item) {
    setModalCancelar(item);
  }

  function confirmarCancelamento() {
    setDadosSolicitacoes(prev => {
      if (!prev) return null; 
      return {
        ...prev,
        solicitacoes: prev.solicitacoes.map(s =>
          s.id === modalCancelar.id ? { ...s, status: "cancelado" } : s 
        )
      };
    });
    setModalCancelar(null);
  }

  useEffect(() => {
    const estaLogado = localStorage.getItem("dadosUsuario");
    if (!estaLogado) {
      router.push("/login")
    }
  }, [])

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("dadosUsuario"));
    if (dados) {
      try {
        setDadosUsuario(dados);
        fetch("http://localhost:3001/api/solicitacoes", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${dados.token}`,
          }
        })
          .then(response => response.json())
          .then(data => setDadosSolicitacoes(data))
          .catch(error => console.error("Erro ao buscar solicitações:", error));
      } catch (e) {
        console.error("Erro ao ler dadosUsuario do localStorage:", e);
      }
    }
  }, []);

  const getBadgeClass = (status) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "atendido":
      case "aprovado":
        return "bg-success";
      case "negado":
      case "cancelado":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

 
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  


 
  const solicitacoesFiltradas =
    dadosSolicitacoes?.solicitacoes.filter((s) => {
      const txt = busca.toLowerCase();

      const matchBusca =
        s.produto_nome.toLowerCase().includes(txt) ||
        s.descricao.toLowerCase().includes(txt) ||
        s.status.toLowerCase().includes(txt);

      const matchStatus =
        filtroStatus === "todos" ||
        filtroStatus === s.status.toLowerCase();

      return matchBusca && matchStatus;
    }) || [];


  if (dadosUsuario === null || dadosSolicitacoes === null) {
    return <p>Carregando...</p>
  }

  return (
    <main style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
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

        <div className="text-center mb-4">
          <h1 className="fw-bold display-6 mb-2" style={{ color: "var(--primary-color)" }}>
            Histórico de Solicitações
          </h1>
          <p className="text-muted fs-5 mb-0">
            Consulte todas as solicitações feitas e seus respectivos status.
          </p>
        </div>


      
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por material, descrição ou status..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value.toLowerCase())}
            >
              <option value="todos">Todos os Status</option>
              <option value="aprovado">Aprovado</option>
              <option value="atendido">Finalizado</option>
              <option value="negado">Negado</option>
              <option value="cancelado">Cancelado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>
       


        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-body p-4">

            {solicitacoesFiltradas.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Data</th>
                      <th>Material</th>
                      <th className="text-center">Status</th>
                      <th>Descrição</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>

                
                    {solicitacoesFiltradas.map((s) => (
                  

                      <tr key={s.id}>
                        <td>
                          {new Date(s.data_solicitacao).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).replace(",", "")}
                        </td>

                        <td>{s.produto_nome}</td>

                        <td className="text-center">
                          <span
                            className={`badge px-3 py-2 fs-6 fw-semibold ${getBadgeClass(s.status)}`}
                            style={{ minWidth: "120px" }}
                          >
                            {s.status}
                          </span>
                        </td>

                        <td>{s.descricao}</td>

                        <td>
                          {s.status.toLowerCase() === "pendente" &&(
                              <button
                                className="btn btn-danger btn-sm"
                                title="Cancelar solicitação"
                                onClick={() => cancelarSolicitacao(s)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}

                          {s.status.toLowerCase() === "negado" && (
                            <button
                              className="btn btn-info btn-sm"
                              title="Ver motivo"
                              onClick={() => verDetalhes(s)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          )}
                        </td>

                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                Nenhuma solicitação encontrada.
              </div>
            )}
          </div>
        </div>
      </div>

      
      {modalDetalhes && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Detalhes da Solicitação</h5>
                <button className="btn-close" onClick={() => setModalDetalhes(null)}></button>
              </div>

              <div className="modal-body">
                <p><strong>Material:</strong> {modalDetalhes.produto_nome}</p>
                <p><strong>Descrição:</strong> {modalDetalhes.descricao}</p>
                {modalDetalhes.motivo && <p><strong>Motivo da Negação:</strong> {modalDetalhes.motivo}</p>}
                <p className="text-danger"><strong>Status:</strong> {modalDetalhes.status}</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalDetalhes(null)}>
                  Fechar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {modalCancelar && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Cancelar Solicitação</h5>
                <button className="btn-close" onClick={() => setModalCancelar(null)}></button>
              </div>

              <div className="modal-body">
                Tem certeza que deseja cancelar a solicitação do material:
                <br /><br />
                <strong className="text-danger">{modalCancelar.produto_nome}</strong>?
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalCancelar(null)}>
                  Fechar
                </button>

                <button className="btn btn-danger" onClick={confirmarCancelamento}>
                  <i className="bi bi-trash me-2"></i> Cancelar Solicitação
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
