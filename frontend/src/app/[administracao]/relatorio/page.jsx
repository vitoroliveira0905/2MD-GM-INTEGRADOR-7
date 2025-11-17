"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useRouter } from "next/navigation";

export default function Relatorios() {
  const router = useRouter();

  const [tipo, setTipo] = useState("estoque"); // NOVO

  const [movimentacoes, setMovimentacoes] = useState(0);
  const [criticos, setCriticos] = useState(0);
  const [aprovadas, setAprovadas] = useState(0);
  const [recusadas, setRecusadas] = useState(0);

  useEffect(() => {
    async function carregarDados() {
      try {
      
        const estRes = await fetch("http://localhost:3001/estoque");
        const estoque = await estRes.json();

        setMovimentacoes(estoque.length);

        const qtdCriticos = estoque.filter(item => item.quantidade < item.minimo).length;
        setCriticos(qtdCriticos);

        const solRes = await fetch("http://localhost:3001/solicitacoes");
        const solicitacoes = await solRes.json();

        const qtdAprovadas = solicitacoes.filter(s => s.status === "Aprovada").length;
        setAprovadas(qtdAprovadas);

        const qtdRecusadas = solicitacoes.filter(s => s.status === "Recusada").length;
        setRecusadas(qtdRecusadas);

      } catch (err) {
        console.log("Erro ao carregar dados:", err);
      }
    }

    carregarDados();
  }, []);

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

      <h1 className="text-center mb-5 fw-bold" style={{ color: "var(--primary-color)" }}>
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
            </>
          )}

          {tipo === "solicitacoes" && (
            <>
              <li className="list-group-item d-flex justify-content-between">
                <span>Solicitações aprovadas:</span>
                <strong>{aprovadas}</strong>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Solicitações recusadas:</span>
                <strong>{recusadas}</strong>
              </li>
            </>
          )}
        </ul>

        <p className="text-secondary text-center">Resumo de dados atualizados.</p>
      </div>
    </div>
  );
}
