"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function DashboardCliente() {
  const [solicitacoes, setSolicitacoes] = useState([]);


  useEffect(() => {                // vamos colocar a api aqui
    setSolicitacoes([
      { id: 1, data: "04/11/2025", material: "Luvas de proteção", status: "Aprovada", descricao: "Reposição para equipe de manutenção" },
      { id: 2, data: "05/11/2025", material: "Cinto de segurança", status: "Pendente", descricao: "Uso em trabalho em altura" },
      { id: 3, data: "06/11/2025", material: "Capacetes de obra", status: "Negada", descricao: "Solicitação duplicada" },
      { id: 4, data: "06/11/2025", material: "Colete refletivo", status: "Pendente", descricao: "Equipe noturna" },
    ]);
  }, []);

  const totalPendentes = solicitacoes.filter(s => s.status === "Pendente").length;
  const totalAprovadas = solicitacoes.filter(s => s.status === "Aprovada").length;
  const totalNegadas = solicitacoes.filter(s => s.status === "Negada").length;

  return (
    <main style={{ flex: "1", backgroundColor: "#f8f9fa" }}>
      <div className="container py-5">

        <div className="row align-items-center mb-5">
          <div className="col-md-8">
            <h1 className="fw-bold display-5" style={{ color: "  var(--primary-color)" }}>
              Requisições de Materiais
            </h1>
            <p className="text-muted fs-5 mb-0">
              Acompanhe o status das suas solicitações e faça novos pedidos quando precisar.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-4 mt-md-0">
            <Link href="/solicitacao">
              <button
                className="btn btn-lg fw-bold text-white rounded-pill shadow-sm"
                style={{ backgroundColor: "  var(--primary-color)" }}
              >
                <i className="bi bi-plus-circle me-2"></i> Nova Solicitação
              </button>
            </Link>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {[                                    //puxar a api que colocamos
            { titulo: "Pendentes", valor: totalPendentes, icone: "bi-hourglass-split", bg: "  var(--primary-color)20" },
            { titulo: "Aprovadas", valor: totalAprovadas, icone: "bi-check-circle", bg: "  var(--primary-color)20" },
            { titulo: "Negadas", valor: totalNegadas, icone: "bi-x-circle", bg: "  var(--primary-color)20" },
          ].map((card, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center p-4">
                  <div>
                    <h6 className="text-muted mb-2 fs-5">{card.titulo}</h6>
                    <h2 className="fw-bold">{card.valor}</h2>
                  </div>
                  <div
                    className="p-4 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: card.bg }}
                  >
                    <i className={`bi ${card.icone}`} style={{ color: "  var(--primary-color)", fontSize: "28px" }}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0" style={{ color: "  var(--primary-color)" }}>
              Histórico de Solicitações
            </h5>
            <button className="btn btn-link text-decoration-none text-dark">Ver todas</button>
          </div>
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Data</th>
                    <th>Material</th>
                    <th>Status</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoes.map((s, i) => (
                    <tr key={i}>
                      <td>{s.id}</td>
                      <td>{s.data}</td>
                      <td>{s.material}</td>
                      <td>
                        <span
                          className={`badge d-inline-flex justify-content-center align-items-center px-3 py-2 fs-6 ${s.status === "Aprovada"
                              ? "bg-success"
                              : s.status === "Negada"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          style={{ minWidth: "120px" }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td>{s.descricao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>


        <div className="card border-0 shadow-lg rounded-4">
          <div className="card-header bg-white border-0 p-4">
            <h5 className="fw-bold mb-0  " style={{ color: "var(--primary-color)" }}>
              Ações Rápidas
            </h5>
          </div>
          
          
            <div className="card-body d-flex flex-column gap-3 p-3" style={{ maxWidth: "360px" }}>
              <Link href="/solicitacao">
                <button
                  className="btn text-white fw-bold btn-lg rounded-pill"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
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

              <Link href="/login">
                <button className="btn btn-danger fw-bold btn-lg rounded-pill">
                  <i className="bi bi-arrow-left me-2"></i> Sair
                </button>
              </Link>
            </div>

         
       
         




        </div>
      </div>
    </main>
  );
}
