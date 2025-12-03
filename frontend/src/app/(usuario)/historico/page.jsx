"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ModalDetalhes from "@/components/ModalDetalhes";
import ModalCancelar from "@/components/ModalCancelar";
import "./styles.css";

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
          Authorization: `Bearer ${dados.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setDadosSolicitacoes(data))
        .catch((error) => console.error("Erro ao buscar solicitações:", error));
    } catch (e) {
      console.error("Erro ao parsear dadosUsuario do localStorage:", e);
      router.push("/login");
    }
  }, [router]);

  const getBadgeClass = (status) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case "finalizado":
      case "aprovado":
        return "badge-success";
      case "recusado":
        return "badge-danger";
      case "cancelado":
        return "badge-secondary";
      default:
        return "badge-warning";
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
        filtroStatus === "todos" || filtroStatus === s.status.toLowerCase();

      return matchBusca && matchStatus;
    }) || [];

  if (
    dadosUsuario === null ||
    dadosUsuario.usuario.tipo !== "comum" ||
    dadosSolicitacoes === null
  ) {
    return <p>Carregando...</p>;
  }

  return (
    <main style={{ minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>
              Histórico de Solicitações
            </h1>
            <p className="text-muted mb-0">
              Acompanhe suas solicitações e seus status.
            </p>
          </div>
          <div className="d-none d-md-flex align-items-center gap-2">
            <span className="badge rounded-pill bg-primary-subtle text-primary">
              <i className="bi bi-clock-history me-2"></i>
              {solicitacoesFiltradas.length} registro(s)
            </span>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg modern-input"
              placeholder="Buscar por material, descrição ou status..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select form-select-lg modern-input"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value.toLowerCase())}
            >
              <option value="todos">Todos os Status</option>
              <option value="aprovado">Aprovado</option>
              <option value="finalizado">Finalizado</option>
              <option value="recusado">Recusado</option>
              <option value="cancelado">Cancelado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>

        <div className="card border-0 rounded-4 overflow-hidden" style={{boxShadow: "-5px 5px 25px rgba(0, 0, 0, 0.2)"}}>
          <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-table text-primary"></i>
              <span className="fw-semibold">Solicitações</span>
            </div>
            <div className="text-muted small">
              Última atualização em {new Date()
                .toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
                .replace(",", "")}
            </div>
          </div>
          <div className="card-body p-0">
            {solicitacoesFiltradas.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-gradient">
                    <tr>
                      <th scope="col" className="fw-semibold table-gradient">Data</th>
                      <th scope="col" className="fw-semibold table-gradient">Material</th>
                      <th scope="col" className="text-center fw-semibold table-gradient">Status</th>
                      <th scope="col" className="fw-semibold table-gradient">Descrição</th>
                      <th scope="col" className="text-end fw-semibold table-gradient">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacoesFiltradas.map((s) => (
                      <tr key={s.id}>
                        <td className="p-3">
                          {new Date(s.data_solicitacao)
                            .toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
                            .replace(",", "")}
                        </td>
                        <td className="p-3">{s.produto_nome}</td>
                        <td className="text-center p-3">
                          <span className={`badge-status ${getBadgeClass(s.status)}`}>
                            {s.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="desc-cell narrow-desc">{s.descricao}</div>
                        </td>
                        <td className="text-end p-3">
                          <div className="d-inline-flex gap-2 align-items-center">
                            {s.status.toLowerCase() === "pendente" && (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Cancelar solicitação"
                                onClick={() => cancelarSolicitacao(s)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                            <button
                              className="btn btn-primary btn-sm"
                              title="Ver detalhes"
                              onClick={() => verDetalhes(s)}
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
        <ModalDetalhes solicitacao={modalDetalhes} onClose={() => setModalDetalhes(null)} />
      )}

      {modalCancelar && (
        <ModalCancelar
          solicitacao={modalCancelar}
          onClose={() => setModalCancelar(null)}
          onConfirm={confirmarCancelamento}
        />
      )}
    </main>
  );
}
