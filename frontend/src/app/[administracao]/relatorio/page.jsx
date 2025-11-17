"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Relatorios() {

  const [movimentacoes, setMovimentacoes] = useState(0);
  const [criticos, setCriticos] = useState(0);
  const [aprovadas, setAprovadas] = useState(0);
  const [recusadas, setRecusadas] = useState(0);

  
  useEffect(() => {
    async function carregarDados() {
      try {
      
        async function carregarDados() {
            const res = await fetch("http://localhost:3001/");
            const data = await res.json();
          
 
            setMovimentacoes(data.length);
    
            const criticos = data.filter(item => item.quantidade < item.minimo).length;
            setCriticos(criticos);
          
        
            const aprovadas = data.filter(item => item.quantidade >= item.minimo).length;
            setAprovadas(aprovadas);
          

            const recusadas = criticos;
            setRecusadas(recusadas);
          }
          

      } catch (err) {
        console.log("Erro ao carregar dados:", err);
      }
    }

    carregarDados();
  }, []);

  return (
    <div className="container py-5" style={{ marginTop: "40px" }}>

      <h1 className="text-center mb-5 fw-bold" style={{ color: "var(--primary-color)" }}>
        <i className="bi bi-graph-up-arrow me-2"></i> Relatórios
      </h1>

      
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: "16px" }}>
        <h5 className="fw-bold mb-3">
          <i className="bi bi-funnel me-2"></i>Selecione o tipo de relatório
        </h5>

        <select className="form-select w-50">
          <option>Movimentações do Estoque</option>
          <option>Solicitações (Aprovadas / Recusadas)</option>
        </select>
      </div>

     
      <div className="card shadow-lg p-4" style={{ borderRadius: "20px" }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-file-text me-2"></i>Resumo Rápido
        </h4>

        <ul className="list-group mb-4">

          <li className="list-group-item d-flex justify-content-between">
            <span>Total de movimentações:</span>
            <strong>{movimentacoes}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>Itens em nível crítico:</span>
            <strong>{criticos}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>Solicitações aprovadas:</span>
            <strong>{aprovadas}</strong>
          </li>

          <li className="list-group-item d-flex justify-content-between">
            <span>Solicitações recusadas:</span>
            <strong>{recusadas}</strong>
          </li>

        </ul>

        <p className="text-secondary text-center">Resumo atualizado pelos dados da API.</p>
      </div>

    </div>
  );
}
