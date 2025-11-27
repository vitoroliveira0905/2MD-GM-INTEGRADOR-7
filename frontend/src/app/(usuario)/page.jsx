"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";
import dynamic from "next/dynamic";
import ModalDetalhes from "@/components/ModalDetalhes";
import ModalCancelar from "@/components/ModalCancelar";
const ChatWidget = dynamic(() => import("@/components/ChatWidget/page"), { ssr: false });



export default function DashboardCliente() {
  const router = useRouter();
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [dadosSolicitacoes, setDadosSolicitacoes] = useState(null);
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(null);
  const [openChat, setOpenChat] = useState(false);


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

        {/* Hero Section */}
        <div className="hero-section rounded-4 p-4 p-md-5 mb-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center mb-3">
                <div className="hero-icon me-3">
                  <i className="bi bi-box-seam-fill"></i>
                </div>
                <div>
                  <h1 className="fw-bold mb-1" style={{ fontSize: "clamp(24px, 5vw, 42px)", color: "var(--primary-color)" }}>
                    Olá, {dadosUsuario?.usuario?.nome?.split(' ')[0]}!
                  </h1>
                  <p className="text-muted mb-0">Bem-vindo ao seu painel de controle</p>
                </div>
              </div>
              <p className="fs-5 mb-0 text-secondary">
                Acompanhe suas solicitações, faça novos pedidos e mantenha tudo organizado em um só lugar.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-4 mt-md-0">
              <Link href="/solicitacao">
                <button className="btn btn-lg fw-bold text-white rounded-pill shadow-lg hero-button">
                  <i className="bi bi-plus-circle me-2"></i> Nova Solicitação
                </button>
              </Link>
            </div>
          </div>
        </div>


        <div className="row g-4 mb-5">
          {[
            { titulo: "Pendentes", valor: totalPendentes, icone: "bi-hourglass-split" },
            { titulo: "Aprovadas", valor: totalAprovadas, icone: "bi-check-circle" },
            { titulo: "Negadas", valor: totalNegadas, icone: "bi-x-circle" }
          ].map((card, i) => (
            <div key={i} className="col-12 col-md-4">
              <div className="status-card rounded-4">
                <div className="status-card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="status-card-title mb-2">{card.titulo}</h6>
                    <h2 className="status-card-value fw-bold">{card.valor}</h2>
                  </div>

                  <div className="status-card-icon">
                    <i className={`bi ${card.icone}`}></i>
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

                          
                            <button className="btn btn-info btn-sm"
                              onClick={() => verDetalhes(s)}>
                              <i className="bi bi-eye"></i>
                            </button>
                          
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

   


<Link href="/login">
            <button className="btn btn-danger fw-bold btn-lg rounded-pill"
              onClick={() => {
                localStorage.removeItem("dadosUsuario");
                router.push("/login");
              }}>
              <i className="bi bi-arrow-left me-2"></i> Sair
            </button></Link>

          </div>
        </div>

      </div>


      <ModalDetalhes 
        solicitacao={modalDetalhes} 
        onClose={() => setModalDetalhes(null)} 
      />


      <ModalCancelar 
        solicitacao={modalCancelar}
        onClose={() => setModalCancelar(null)}
        onConfirm={confirmarCancelamento}
      />

      {/* 🔵 Bolha flutuante */}
      <button
        onClick={() => setOpenChat(!openChat)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
          color: "white",
          fontSize: "28px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.30)",
          zIndex: 9999,
          animation: openChat ? "none" : "floatButton 2.4s ease-in-out infinite"
        }}
      >
        {openChat ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="white" className="bi bi-x-lg" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        ) : (
          <i className="bi bi-chat-dots-fill" style={{ fontSize: "30px" }}></i>
        )}
      </button>


      {/* 🟦 Caixa do Chat */}
      <div
        style={{
          position: "fixed",
          bottom: openChat ? "100px" : "-520px",
          right: "20px",
          width: "360px",
          height: "500px",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.30)",
          border: "1px solid #e9ecef",
          overflow: "hidden",
          zIndex: 9999,
          transition: "bottom 0.3s ease"
        }}
      >
        <ChatWidget />
      </div>

    </main>
  );
}
