"use client"

import "./styles.css"

export default function ModalDetalhes({ solicitacao, onClose, isAdmin = false }) {
    if (!solicitacao) return null;

    const formatarData = (data) => {
        return new Date(data).toLocaleString("pt-BR", {
            dateStyle: "long",
            timeStyle: "short",
        });
    };

    const getBadgeClass = (status) => {
        const s = status.toLowerCase();
        switch (s) {
            case "atendido":
            case "aprovado":
                return "badge-success";
            case "negado":
            case "cancelado":
                return "badge-danger";
            case "pendente":
                return "badge-warning";
            default:
                return "badge-secondary";
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                
                {/* Header do Modal */}
                <div className="modal-header-custom">
                    <div className="d-flex align-items-center gap-3">
                        <div className="modal-icon">
                            <i className="bi bi-file-text-fill"></i>
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold text-white">Detalhes da Solicitação</h4>
                            <small className="text-white opacity-75">ID: #{solicitacao.id}</small>
                        </div>
                    </div>
                    <button className="btn-close-custom" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Body do Modal */}
                <div className="modal-body-custom">
                    
                    {/* Status Badge */}
                    <div className="text-center mb-4">
                        <span className={`badge-status ${getBadgeClass(solicitacao.status)}`}>
                            <i className="bi bi-circle-fill me-2" style={{ fontSize: "8px" }}></i>
                            {solicitacao.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Informações Principais */}
                    <div className="info-section">
                        <h6 className="section-title">
                            <i className="bi bi-box-seam me-2"></i>
                            Informações do Material
                        </h6>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Material</label>
                                <p>{solicitacao.produto_nome}</p>
                            </div>
                            <div className="info-item">
                                <label>Quantidade</label>
                                <p>{solicitacao.quantidade} unidade(s)</p>
                            </div>
                        </div>
                    </div>

                    {/* Localização */}
                    <div className="info-section">
                        <h6 className="section-title">
                            <i className="bi bi-geo-alt me-2"></i>
                            Localização
                        </h6>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Shop</label>
                                <p>{solicitacao.shop}</p>
                            </div>
                            <div className="info-item">
                                <label>Área</label>
                                <p>{solicitacao.area}</p>
                            </div>
                        </div>
                    </div>

                    {/* Solicitante (apenas para admin) */}
                    {isAdmin && solicitacao.usuario_nome && (
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
                            </div>
                        </div>
                    )}

                    {/* Descrição */}
                    {solicitacao.descricao && (
                        <div className="info-section">
                            <h6 className="section-title">
                                <i className="bi bi-chat-left-text me-2"></i>
                                Descrição
                            </h6>
                            <div className="info-description">
                                {solicitacao.descricao}
                            </div>
                        </div>
                    )}

                    {/* Observação/Motivo (caso negado) */}
                    {solicitacao.observacao && (
                        <div className="info-section">
                            <h6 className="section-title text-danger">
                                <i className="bi bi-exclamation-triangle me-2"></i>
                                {solicitacao.status === "negado" ? "Motivo da Negação" : "Observação"}
                            </h6>
                            <div className="info-description alert-danger">
                                {solicitacao.observacao}
                            </div>
                        </div>
                    )}

                    {/* Datas */}
                    <div className="info-section">
                        <h6 className="section-title">
                            <i className="bi bi-calendar-event me-2"></i>
                            Cronologia
                        </h6>
                        <div className="info-timeline">
                            <div className="timeline-item">
                                <i className="bi bi-clock-history text-primary"></i>
                                <div>
                                    <label>Solicitado em</label>
                                    <p>{formatarData(solicitacao.data_solicitacao)}</p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <i className="bi bi-arrow-repeat text-success"></i>
                                <div>
                                    <label>Última atualização</label>
                                    <p>{formatarData(solicitacao.data_atualizacao)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer do Modal */}
                <div className="modal-footer-custom">
                    <button className="btn-fechar" onClick={onClose}>
                        <i className="bi bi-x-circle me-2"></i>
                        Fechar
                    </button>
                </div>

            </div>
        </div>
    );
}
