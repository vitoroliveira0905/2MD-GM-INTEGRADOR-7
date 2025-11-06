"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Historico() {
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    setSolicitacoes([
      { id: 1, data: "04/11/2025", material: "Luvas de proteção", status: "Aprovada", descricao: "Reposição para equipe de manutenção" },
      { id: 2, data: "05/11/2025", material: "Cinto de segurança", status: "Pendente", descricao: "Uso em trabalho em altura" },
      { id: 3, data: "06/11/2025", material: "Capacetes de obra", status: "Negada", descricao: "Solicitação duplicada" },
      { id: 4, data: "06/11/2025", material: "Colete refletivo", status: "Pendente", descricao: "Equipe noturna" },
      { id: 5, data: "07/11/2025", material: "Botas de borracha", status: "Aprovada", descricao: "Substituição de EPI danificado" },
    ]);
  }, []);

  // Função para cor da badge (mais legível)
  const getBadgeClass = (status) => {
    switch (status) {
      case "Aprovada":
        return "bg-success";
      case "Negada":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

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

  
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-body p-4">
            {solicitacoes.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Data</th>
                      <th>Material</th>
                      <th className="text-center">Status</th>
                      <th>Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitacoes.map((s) => (
                      <tr key={s.id}>
                        <td className="text-center">{s.id}</td>
                        <td>{s.data}</td>
                        <td>{s.material}</td>
                        <td className="text-center">
                          <span
                            className={`badge px-3 py-2 fs-6 fw-semibold ${getBadgeClass(s.status)}`}
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
            ) : (
              <div className="text-center text-muted py-5">
                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                Nenhuma solicitação encontrada.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
