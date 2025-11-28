"use client";

export default function ToastNotification({ notificacoes, onClose }) {
	return (
		<div className="toast-stack">
			{notificacoes.map((n) => (
				<div
					key={n.id}
					className={`toast-notificacao toast-${n.tipo}`}
					role="alert"
				>
					<span className="icon-wrapper">
						{renderIconeTipo(n.tipo)}
					</span>
					<span className="texto">{n.texto}</span>
					<button
						onClick={() => onClose(n.id)}
						className="btn-close-toast"
						aria-label="Fechar"
					>
						<i className="bi bi-x"></i>
					</button>
				</div>
			))}
		</div>
	);
}

// Ícones dinâmicos para notificações
function renderIconeTipo(tipo) {
	switch (tipo) {
		case 'success':
			return <i className="bi bi-check-circle"></i>;
		case 'error':
			return <i className="bi bi-exclamation-octagon"></i>;
		case 'warn':
			return <i className="bi bi-exclamation-triangle"></i>;
		default:
			return <i className="bi bi-info-circle"></i>;
	}
}
