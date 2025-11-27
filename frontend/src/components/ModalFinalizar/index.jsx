import "./styles.css";

export default function ModalFinalizar({ solicitacao, onClose, onConfirm }) {
	if (!solicitacao) return null;

	return (
		<div className="modal-overlay-finalizar" onClick={onClose}>
			<div className="modal-content-finalizar" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header-finalizar">
					<i className="bi bi-check-circle-fill me-2"></i>
					<h5>Finalizar Solicitação</h5>
					<button className="btn-close-finalizar" onClick={onClose}>
						<i className="bi bi-x-lg"></i>
					</button>
				</div>

				<div className="modal-body-finalizar">
					<div className="alert alert-info d-flex align-items-start">
						<i className="bi bi-info-circle-fill me-2 mt-1"></i>
						<div>
							<strong>Atenção:</strong> Ao finalizar esta solicitação, você confirma que o material foi retirado do estoque e entregue ao solicitante.
						</div>
					</div>

					<div className="info-section-finalizar">
						<h6 className="text-muted mb-3">
							<i className="bi bi-box-seam me-2"></i>Informações do Material
						</h6>
						<div className="info-grid-finalizar">
							<div className="info-item-finalizar">
								<span className="info-label-finalizar">Material:</span>
								<span className="info-value-finalizar">{solicitacao.produto}</span>
							</div>
							<div className="info-item-finalizar">
								<span className="info-label-finalizar">Quantidade:</span>
								<span className="info-value-finalizar">{solicitacao.quantidade}</span>
							</div>
							<div className="info-item-finalizar">
								<span className="info-label-finalizar">Área:</span>
								<span className="info-value-finalizar">{solicitacao.area}</span>
							</div>
						</div>
					</div>

					<div className="info-section-finalizar">
						<h6 className="text-muted mb-3">
							<i className="bi bi-person-fill me-2"></i>Solicitante
						</h6>
						<div className="info-grid-finalizar">
							<div className="info-item-finalizar">
								<span className="info-label-finalizar">Nome:</span>
								<span className="info-value-finalizar">{solicitacao.usuario_nome}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="modal-footer-finalizar">
					<button className="btn-cancelar-finalizar" onClick={onClose}>
						<i className="bi bi-x-circle me-2"></i>
						Cancelar
					</button>
					<button className="btn-confirmar-finalizar" onClick={onConfirm}>
						<i className="bi bi-check-circle me-2"></i>
						Confirmar Retirada
					</button>
				</div>
			</div>
		</div>
	);
}
