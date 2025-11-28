"use client"

import "./styles.css"

export default function ModalExcluir({ material, onClose, onConfirm }) {
  if (!material) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <div className="d-flex align-items-center gap-3">
            <div className="modal-icon">
              <i className="bi bi-trash-fill"></i>
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-white">Excluir Material</h4>
              <small className="text-white opacity-75">ID: #{material.id}</small>
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
              Informações do Material
            </h6>
            <div className="info-grid">
              <div className="info-item">
                <label>Material</label>
                <p>{material.nome}</p>
              </div>
              <div className="info-item">
                <label>Categoria</label>
                <p>{material.categoria || '-'}</p>
              </div>
              <div className="info-item">
                <label>Quantidade</label>
                <p>{material.quantidade} unidade(s)</p>
              </div>
              <div className="info-item">
                <label>Estoque Mínimo</label>
                <p>{material.minimo_estoque} unidade(s)</p>
              </div>
            </div>
          </div>

          <div className="info-description alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Atenção:</strong> Esta ação não pode ser desfeita. Tem certeza que deseja excluir este material permanentemente?
          </div>
        </div>

        <div className="modal-footer-custom">
          <button className="btn-fechar" onClick={onClose}>
            <i className="bi bi-arrow-left-circle me-2"></i>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            <i className="bi bi-trash me-2"></i>
            Confirmar Exclusão
          </button>
        </div>
      </div>
    </div>
  );
}
