"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PainelSolicitacao() {
  const router = useRouter();

  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [observacao, setObservacao] = useState("");

  
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  useEffect(() => {
    const dadosFalsos = [   //teste sem api
      {
        id: 1,
        produto: "Parafuso M10",
        quantidade: 50,
        shop: "Manutenção",
        area: "Oficina 1",
        prioridade: "Alta",
        descricao: "Reposição urgente de parafusos",
        status: "Pendente",
        solicitante: "Carlos Silva",
        data: "2025-11-10",
      },
      {
        id: 2,
        produto: "Óleo Lubrificante",
        quantidade: 10,
        shop: "Produção",
        area: "Linha A",
        prioridade: "Média",
        descricao: "Manutenção preventiva",
        status: "Pendente",
        solicitante: "Mariana Souza",
        data: "2025-11-08",
      },
      {
        id: 3,
        produto: "Luvas térmicas",
        quantidade: 5,
        shop: "Segurança",
        area: "Linha B",
        prioridade: "Baixa",
        descricao: "Reposição de EPIs",
        status: "Pendente",
        solicitante: "João Lima",
        data: "2025-11-05",
      },
    ];
    setSolicitacoes(dadosFalsos);
  }, []);

  const atualizarStatus = (id, novoStatus, obs = "") => {
    setSolicitacoes((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: novoStatus, observacao: obs }
          : item
      )
    );
    setMensagem(`Solicitação ${novoStatus.toLowerCase()} com sucesso!`);
    setTimeout(() => setMensagem(""), 3000);
  };

  const verDetalhes = (item) => {
    setSelecionada(item);
    setAbaAtiva("detalhes");
  };

  const voltar = () => {
    setSelecionada(null);
    setAbaAtiva("pendentes");
  };

  const abrirModal = (item) => {
    setSelecionada(item);
    setObservacao("");
    setModalAberto(true);
  };

  const confirmarRecusa = () => {
    if (selecionada) {
      atualizarStatus(selecionada.id, "Recusada", observacao);
    }
    setModalAberto(false);
  };


  const pendentes = solicitacoes.filter((s) => {
    const txt = busca.toLowerCase();
    const matchBusca =
      s.produto.toLowerCase().includes(txt) ||
      s.solicitante.toLowerCase().includes(txt);

    return s.status === "Pendente" && matchBusca;
  });


  const historico = solicitacoes.filter((s) => {
    const txt = busca.toLowerCase();

    const matchBusca =
      s.produto.toLowerCase().includes(txt) ||
      s.solicitante.toLowerCase().includes(txt);

    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "aprovada" && s.status === "Aprovada") ||
      (filtroStatus === "recusada" && s.status === "Recusada") ||
      (filtroStatus === "finalizada" && s.status === "Finalizada");

    return s.status !== "Pendente" && matchBusca && matchStatus;
  });

  return (
    <div className="container my-5">

   
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
        <i className="bi bi-list-check me-2"></i> Painel de Solicitações
      </h1>

      {mensagem && (
        <div className="alert alert-success text-center">{mensagem}</div>
      )}

      <ul className="nav nav-tabs mb-4 justify-content-center">
        <li className="nav-item">
          <button
            className={`nav-link ${abaAtiva === "pendentes" ? "active fw-bold" : ""}`}
            onClick={() => setAbaAtiva("pendentes")}
          >
            Pendentes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${abaAtiva === "historico" ? "active fw-bold" : ""}`}
            onClick={() => setAbaAtiva("historico")}
          >
            Histórico
          </button>
        </li>
      </ul>

  
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por produto ou solicitante..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        
        {abaAtiva === "historico" && (
          <div className="col-md-4">
            <select
              className="form-select"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="todos">Todos os Status</option>
              <option value="aprovada">Aprovadas</option>
              <option value="recusada">Recusadas</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>
        )}
      </div>

    
      {abaAtiva === "pendentes" && (
        <div>
          {pendentes.length === 0 ? (
            <div className="alert alert-secondary text-center">
              Nenhuma solicitação pendente.
            </div>
          ) : (
            <div className="table-responsive shadow-sm rounded">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Área</th>
                    <th>Solicitante</th>
                    <th>Prioridade</th>
                    <th>Status</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {pendentes.map((item) => (
                    <tr key={item.id}>
                      <td>{item.data}</td>
                      <td>{item.produto}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.area}</td>
                      <td>{item.solicitante}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.prioridade === "Alta"
                              ? "bg-danger"
                              : item.prioridade === "Média"
                              ? "bg-warning text-dark"
                              : "bg-success"
                          }`}
                        >
                          {item.prioridade}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{item.status}</span>
                      </td>

                      
                      <td className="text-center">
                        <div className="d-flex flex-column flex-md-row justify-content-center gap-2">

                        
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => atualizarStatus(item.id, "Aprovada")}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>

                       
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => abrirModal(item)}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>

                      
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => verDetalhes(item)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}

     
      {modalAberto && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  Recusar Solicitação #{selecionada?.id}
                </h5>
                <button className="btn-close" onClick={() => setModalAberto(false)}></button>
              </div>

              <div className="modal-body">
                <p>
                  Tem certeza que deseja recusar{" "}
                  <strong>{selecionada?.produto}</strong>?
                </p>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Justificativa..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>

                <button className="btn btn-danger" onClick={confirmarRecusa}>
                  Confirmar Recusa
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      
      {abaAtiva === "historico" && (
        <div>
          {historico.length === 0 ? (
            <div className="alert alert-secondary text-center">
              Nenhum histórico encontrado com os filtros.
            </div>
          ) : (
            <div className="table-responsive shadow-sm rounded">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Solicitante</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {historico.map((item) => (
                    <tr key={item.id}>
                       <td>{item.data}</td>
                      <td>{item.produto}</td>
                      <td>{item.quantidade}</td>
                      <td>{item.solicitante}</td>
                      <td>{item.data}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "Aprovada"
                              ? "bg-success"
                              : item.status === "Recusada"
                              ? "bg-danger"
                              : "bg-primary"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">

                         
                          {item.status === "Aprovada" && (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => atualizarStatus(item.id, "Finalizada")}
                            >
                              <i className="bi bi-box-seam"></i>
                            </button>
                          )}

                       
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => verDetalhes(item)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}


      {abaAtiva === "detalhes" && selecionada && (
        <div className="card shadow-sm p-4">
          <h4 className="mb-3 text-primary fw-bold">
            Detalhes da Solicitação #{selecionada.id}
          </h4>

          <p><strong>Produto:</strong> {selecionada.produto}</p>
          <p><strong>Quantidade:</strong> {selecionada.quantidade}</p>
          <p><strong>Área:</strong> {selecionada.area}</p>
          <p><strong>Solicitante:</strong> {selecionada.solicitante}</p>
          <p><strong>Data:</strong> {selecionada.data}</p>
          <p><strong>Descrição:</strong> {selecionada.descricao}</p>
          <p><strong>Status:</strong> {selecionada.status}</p>

          {selecionada.observacao && (
            <p><strong>Observação:</strong> {selecionada.observacao}</p>
          )}

          <button className="btn btn-secondary mt-3" onClick={voltar}>
            <i className="bi bi-arrow-left"></i> Voltar
          </button>
        </div>
      )}

    </div>
  );
}
