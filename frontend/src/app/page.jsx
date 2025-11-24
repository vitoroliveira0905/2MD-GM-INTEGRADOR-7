"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function DashboardCliente() {
  const router = useRouter();
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [dadosSolicitacoes, setDadosSolicitacoes] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(null);


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
      console.error("Erro ao parsear dadosUsuario do localStorage:", e);
      router.push("/login");
    }
  }, [])


  if (dadosUsuario === null || dadosUsuario.usuario.tipo !== "comum" || dadosSolicitacoes === null) {
    return <p>Carregando...</p>
  }


  const getBadgeClass = (status) => {
    const s = status.toLowerCase();
    switch (s) {
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


  const totalPendentes = dadosSolicitacoes.solicitacoes.filter(s => s.status === "pendente").length;
  const totalAprovadas = dadosSolicitacoes.solicitacoes.filter(s => s.status === "aprovado").length;
  const totalNegadas = dadosSolicitacoes.solicitacoes.filter(s => s.status === "negado").length;


  function verDetalhes(item) {
    setModalDetalhes(item);
  }

  function cancelarSolicitacao(item) {
    setModalCancelar(item);
  }


  async function confirmarCancelamento() {
    try {
      const dados = JSON.parse(localStorage.getItem("dadosUsuario"));

      const response = await fetch(
        `http://localhost:3001/api/solicitacoes/${modalCancelar.id}/cancelar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${dados.token}`
          }
        }
      );

      if (!response.ok) {
        const err = await response.json();
        alert("Erro ao cancelar: " + (err?.mensagem || err?.erro));
        return;
      }


      setDadosSolicitacoes(prev => {
        const lista = prev.solicitacoes || [];
        return {
          solicitacoes: lista.map(s =>
            s.id === modalCancelar.id ? { ...s, status: "cancelado" } : s
          )
        };
      });

      setModalCancelar(null);

    } catch (error) {
      console.error("Erro ao cancelar:", error);
    }
  }

  return (
    <main style={{ flex: "1", backgroundColor: "#f8f9fa" }}>
      <div className="container py-5">


        <div className="row align-items-center mb-5">
          <div className="col-md-8">
            <h1 className="fw-bold display-5" style={{ color: "var(--primary-color)" }}>
              Requisições de Materiais
            </h1>
            <p className="text-muted fs-5 mb-0">
              Acompanhe o status de suas solicitações e faça novos pedidos quando precisar.
            </p>
          </div>

          <div className="col-md-4 text-md-end mt-4 mt-md-0">
            <Link href="/solicitacao">
              <button className="btn btn-lg fw-bold text-white rounded-pill shadow-sm"
                style={{ backgroundColor: "var(--primary-color)" }}>
                <i className="bi bi-plus-circle me-2"></i> Nova Solicitação
              </button>
            </Link>
          </div>
        </div>


        <div className="row g-4 mb-5">
          {[
            { titulo: "Pendentes", valor: totalPendentes, icone: "bi-hourglass-split" },
            { titulo: "Aprovadas", valor: totalAprovadas, icone: "bi-check-circle" },
            { titulo: "Negadas", valor: totalNegadas, icone: "bi-x-circle" }
          ].map((card, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center p-4">
                  <div>
                    <h6 className="text-muted mb-2 fs-5">{card.titulo}</h6>
                    <h2 className="fw-bold">{card.valor}</h2>
                  </div>

                  <div className="p-4 rounded-circle"
                    style={{ backgroundColor: "var(--primary-color)20" }}>
                    <i className={`bi ${card.icone}`}
                      style={{ color: "var(--primary-color)", fontSize: "28px" }}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-white border-0 p-4">
            <h5 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>
              Solicitações em andamento
            </h5>
          </div>

          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Material</th>
                    <th className="text-center">Status</th>
                    <th>Descrição</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {(dadosSolicitacoes?.solicitacoes || [])
                    .filter((material) => material.status === "pendente" || material.status === "aprovado")
                    .sort((a, b) => {
                      return ["aprovado", "pendente"].indexOf(a.status) - ["aprovado", "pendente"].indexOf(b.status);
                    })
                    .map((s, i) => (
                      <tr key={i}>
                        <td>
                          {new Date(s.data_solicitacao).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          }).replace(",", "")}
                        </td>

                        <td>{s.produto_nome}</td>

                        <td className="text-center">
                          <span className={`badge px-3 py-2 fs-6 fw-semibold ${getBadgeClass(s.status)}`}
                            style={{ minWidth: "120px" }}>
                            {s.status}
                          </span>
                        </td>

                        <td>{s.descricao}</td>

                        <td>
                          {s.status === "pendente" && (
                            <button className="btn btn-danger btn-sm"
                              onClick={() => cancelarSolicitacao(s)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          )}

                          {s.status === "negado" && (
                            <button className="btn btn-info btn-sm"
                              onClick={() => verDetalhes(s)}>
                              <i className="bi bi-eye"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>


        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-header bg-white border-0 p-4">
            <h5 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>
              Ações Rápidas
            </h5>
          </div>

          <div className="card-body d-flex flex-column gap-3 p-3" style={{ maxWidth: "360px" }}>

            <Link href="/solicitacao">
              <button className="btn text-white fw-bold btn-lg rounded-pill"
                style={{ backgroundColor: "var(--primary-color)" }}>
                <i className="bi bi-plus-circle me-2"></i> Fazer Nova Solicitação
              </button>
            </Link>

            <Link href="/historico">
              <button className="btn btn-outline-dark btn-lg rounded-pill">
                <i className="bi bi-clock-history me-2"></i> Ver Histórico Completo
              </button>
            </Link>

            <Link href="/suporte">
              <button className="btn btn-dark fw-bold btn-lg rounded-pill">
                <i className="bi bi-headset me-2"></i> Falar com o Suporte
              </button>
            </Link>

            <button className="btn btn-danger fw-bold btn-lg rounded-pill"
              onClick={() => {
                localStorage.removeItem("dadosUsuario");
                router.push("/login");
              }}>
              <i className="bi bi-arrow-left me-2"></i> Sair
            </button>

          </div>
        </div>

      </div>


      {modalDetalhes && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Detalhes</h5>
                <button className="btn-close" onClick={() => setModalDetalhes(null)}></button>
              </div>

              <div className="modal-body">
                <p><strong>Material:</strong> {modalDetalhes.produto_nome}</p>
                <p><strong>Motivo:</strong> {modalDetalhes.motivo || "Sem descrição"}</p>
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
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Cancelar Solicitação</h5>
                <button className="btn-close" onClick={() => setModalCancelar(null)}></button>
              </div>

              <div className="modal-body">
                Tem certeza que deseja cancelar:
                <br /><br />
                <strong>{modalCancelar.produto_nome}</strong>?
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalCancelar(null)}>
                  Fechar
                </button>

                <button className="btn btn-danger" onClick={confirmarCancelamento}>
                  Cancelar Solicitação
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
