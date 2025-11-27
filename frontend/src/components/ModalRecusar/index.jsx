"use client"

import "./styles.css"

export default function ModalRecusar({ solicitacao, onClose, onConfirm, observacao, setObservacao }) {
  if (!solicitacao) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <div className="d-flex align-items-center gap-3">
            <div className="modal-icon">
              <i className="bi bi-x-octagon-fill"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-white">Recusar Solicitação</h4>
              <small className="text-white opacity-75">ID: #{solicitacao.id}</small>
            </div>
          </div>
          <button className="btn-close-custom" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="modal-body-custom">
          <div className="info-section">
            <h6 className="section-title">
              <i className="bi bi-box-seam me-2"></i>
              Solicitação
            </h6>
            <div className="info-grid">
              <div className="info-item">
                <label>Material</label>
                <p>{solicitacao.produto_nome || solicitacao.produto}</p>
              </div>
              <div className="info-item">
                <label>Quantidade</label>
                <p>{solicitacao.quantidade} unidade(s)</p>
              </div>
            </div>
          </div>

          <div className="info-description alert-danger mb-3">
            Tem certeza que deseja recusar esta solicitação?
          </div>

          <div className="info-section">
            <h6 className="section-title">
              <i className="bi bi-chat-left-text me-2"></i>
              Justificativa
            </h6>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Digite o motivo da recusa..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "1px solid #dee2e6",
                padding: "12px",
                fontSize: "14px",
                resize: "vertical"
              }}
            />
          </div>
        </div>

        <div className="modal-footer-custom">
          <button className="btn-fechar" onClick={onClose}>
            <i className="bi bi-arrow-left-circle me-2"></i>
            Voltar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            <i className="bi bi-x-circle me-2"></i>
            Confirmar Recusa
          </button>
        </div>
      </div>
    </div>
  );
}
