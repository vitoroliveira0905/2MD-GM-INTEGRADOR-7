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
    switch (status) {
      case "atendido":
        return "bg-success";
      case "aprovado":
        return "bg-success";
      case "negado":
        return "bg-danger";
      case "cancelado":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

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


        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-body p-4">
            {dadosSolicitacoes.solicitacoes.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>

                      <th>Data</th>
                      <th>Material</th>
                      <th className="text-center">Status</th>
                      <th>Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosSolicitacoes.solicitacoes.map((s) => (
                      <tr key={s.id}>

                        <td>{new Date(s.data_solicitacao).toLocaleString("pt-BR", {
                          dateStyle: "short",  
                          timeStyle: "short"   
                        })
                        .replace(",", "")}
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
