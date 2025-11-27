"use client"

import "./styles.css"

export default function ModalAprovar({ solicitacao, onClose, onConfirm }) {
    if (!solicitacao) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-custom modal-header-success">
                    <div className="d-flex align-items-center gap-3">
                        <div className="modal-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold text-white">Aprovar Solicitação</h4>
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

                    <div className="info-section">
                        <h6 className="section-title">
                            <i className="bi bi-person-fill me-2"></i>
                            Solicitante
                        </h6>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Nome</label>
                                <p>{solicitacao.usuario_nome}</p>
                            </div>
                            <div className="info-item">
                                <label>Área</label>
                                <p>{solicitacao.area || solicitacao.shop}</p>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <div className="modal-footer-custom">
                    <button className="btn-fechar" onClick={onClose}>
                        <i className="bi bi-arrow-left-circle me-2"></i>
                        Voltar
                    </button>
                    <button className="btn-confirm btn-confirm-success" onClick={onConfirm}>
                        <i className="bi bi-check-circle me-2"></i>
                        Confirmar Aprovação
                    </button>
                </div>
            </div>
        </div>
    );
}
