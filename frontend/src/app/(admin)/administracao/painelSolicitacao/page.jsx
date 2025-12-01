"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ModalDetalhes from "@/components/ModalDetalhes";
import ModalRecusar from "@/components/ModalRecusar";
import ModalAprovar from "@/components/ModalAprovar";
import ModalFinalizar from "@/components/ModalFinalizar";
import ToastNotification from "@/components/ToastNotification";
import "@/components/ToastNotification/styles.css";
import "./styles.css";


export default function PainelSolicitacao() {
	const router = useRouter();

	const [abaAtiva, setAbaAtiva] = useState("pendentes");
	const [solicitacoes, setSolicitacoes] = useState([]); // array normalizado para exibição
	const [selecionada, setSelecionada] = useState(null);
	// Sistema novo de notificações flutuantes
	const [notificacoes, setNotificacoes] = useState([]); // {id, tipo: 'success'|'error'|'info'|'warn', texto}
	const [modalAberto, setModalAberto] = useState(false);
	const [modalAprovarAberto, setModalAprovarAberto] = useState(false);
	const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false);
	const [observacao, setObservacao] = useState("");
	const [busca, setBusca] = useState("");
	const [filtroStatus, setFiltroStatus] = useState("todos");
	const [dadosUsuario, setDadosUsuario] = useState(null);

	useEffect(() => {
		const dadosString = localStorage.getItem("dadosUsuario");
		if (!dadosString) {
			router.push("/login");
			return;
		}
		try {
			const dados = JSON.parse(dadosString);
			// se for usuário comum, redireciona (painel é para admin)
			if (dados.usuario?.tipo === "comum") {
				router.push("/");
				return;
			}
			setDadosUsuario(dados);

			fetch("http://localhost:3001/api/solicitacoes?pagina=1&limite=100", {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${dados.token}`,
				},
			})
				.then((response) => response.json())
				.then((data) => {
					// normaliza o array vindo da API para o formato usado neste componente
					const normalizado = (data?.solicitacoes || []).map((s) => {
						const statusOriginal = (s.status || "").toLowerCase();
						// Mapeia para nomes usados internamente (capitalizados)
						const statusMap = {
							pendente: "pendente",
							aprovado: "aprovado",
							recusado: "recusado",
							finalizado: "finalizado",
							cancelado: "cancelado",
						};
						return {
							id: s.id,
							produto: s.produto_nome || s.produto || "-",
							produto_nome: s.produto_nome || s.produto || "-", // Para o ModalDetalhes
							quantidade: s.quantidade ?? s.qtd ?? "-",
							area: s.area || s.shop || "-",
							shop: s.shop || s.area || "-", // Para o ModalDetalhes
							usuario_nome: s.usuario_nome || s.usuario?.nome || "-",
							descricao: s.descricao || "",
							status: statusMap[statusOriginal] || s.status || "-",
							data_solicitacao: s.data_solicitacao,
							data_atualizacao: s.data_atualizacao || s.data_solicitacao,
							observacao: s.motivo || s.observacao || undefined,
						};
					});
					setSolicitacoes(normalizado);
				})
				.catch((error) => console.error("Erro ao buscar solicitações:", error));
		} catch (e) {
			console.error("Erro ao parsear dadosUsuario do localStorage:", e);
			router.push("/login");
		}
	}, []);

	if (dadosUsuario === null || dadosUsuario.usuario.tipo !== "admin" || solicitacoes === null) {
		return <p>Carregando...</p>
	}

	const pushNotificacao = (tipo, texto, tempo = 3000) => {
		const id = Date.now() + Math.random();
		setNotificacoes((prev) => [...prev, { id, tipo, texto }]);
		if (tempo > 0) {
			setTimeout(() => {
				setNotificacoes((prev) => prev.filter((n) => n.id !== id));
			}, tempo);
		}
	};

	const atualizarStatus = async (id, novoStatus, obs = "") => {
		const backup = solicitacoes;

		setSolicitacoes((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, status: novoStatus, observacao: obs } : item
			)
		);

		if (!dadosUsuario?.token) {
			pushNotificacao("error", "Sessão expirada. Faça login novamente.");
			return;
		}

		try {
			const res = await fetch(`http://localhost:3001/api/solicitacoes/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${dadosUsuario.token}`,
				},
				body: JSON.stringify({ status: novoStatus, observacao: obs }),
			});

			if (!res.ok) {
				// Tenta parsear como JSON primeiro
				let errorData;
				const contentType = res.headers.get("content-type");
				
				if (contentType && contentType.includes("application/json")) {
					errorData = await res.json();
				} else {
					const errorText = await res.text();
					// Tenta parsear o texto como JSON
					try {
						errorData = JSON.parse(errorText);
					} catch {
						errorData = { erro: errorText };
					}
				}

				// Reverte o estado antes de lançar o erro
				setSolicitacoes(backup);

				// Tratamento específico para estoque insuficiente
				if (errorData.erro === "Estoque insuficiente" || /estoque insuficiente/i.test(errorData.erro)) {
					const quantidade = errorData.mensagem?.match(/\((\d+)\)/g);
					let msg = "Não foi possível aprovar: estoque insuficiente.";
					if (quantidade && quantidade.length === 2) {
						const estoqueAtual = quantidade[0].replace(/[()]/g, "");
						const qtdSolicitada = quantidade[1].replace(/[()]/g, "");
						msg = `Estoque insuficiente. Disponível: ${estoqueAtual}, Solicitado: ${qtdSolicitada}.`;
					}
					pushNotificacao("error", msg);
					return;
				}

				// Outros erros
				const mensagemErro = errorData.mensagem || errorData.erro || "Erro ao atualizar solicitação.";
				pushNotificacao("error", mensagemErro);
				return;
			}

			// Mensagens aprimoradas
			const mapaTexto = {
				aprovado: "Solicitação aprovada com sucesso.",
				recusado: "Solicitação recusada. Justificativa registrada.",
				finalizado: "Solicitação finalizada. Estoque atualizado.",
				cancelado: "Solicitação cancelada.",
				pendente: "Status alterado para pendente.",
			};
			pushNotificacao("success", mapaTexto[novoStatus] || "Status atualizado.");
		} catch (error) {
			console.error("Falha ao atualizar status:", error);
			// Reverte para o estado anterior em caso de erro
			setSolicitacoes(backup);

			// Tratamento para erros de rede ou outros erros inesperados
			const mensagemAmigavel = error.message || "Erro ao conectar com o servidor.";
			pushNotificacao("error", mensagemAmigavel);
		}
	};

	const verDetalhes = (item) => {
		setSelecionada(item);
		setModalAberto(false);
	};

	const abrirModal = (item) => {
		setSelecionada(null); // Limpa a selecionada do modal de detalhes
		setObservacao("");
		setTimeout(() => {
			setSelecionada(item);
			setModalAberto(true);
		}, 0);
	};

	const abrirModalAprovar = (item) => {
		setSelecionada(null);
		setTimeout(() => {
			setSelecionada(item);
			setModalAprovarAberto(true);
		}, 0);
	};
	
	const confirmarAprovacao = () => {
		if (selecionada) {
			atualizarStatus(selecionada.id, "aprovado");
		}
		setModalAprovarAberto(false);
		setSelecionada(null);
	};

	const confirmarRecusa = () => {
		if (selecionada) {
			atualizarStatus(selecionada.id, "recusado", observacao);
		}
		setModalAberto(false);
		setSelecionada(null); // Limpa a seleção ao confirmar
	};

	const abrirModalFinalizar = (item) => {
		setSelecionada(null);
		setTimeout(() => {
			setSelecionada(item);
			setModalFinalizarAberto(true);
		}, 0);
	};

	const confirmarFinalizacao = () => {
		if (selecionada) {
			atualizarStatus(selecionada.id, "finalizado");
		}
		setModalFinalizarAberto(false);
		setSelecionada(null);
	};


	const pendentes = solicitacoes.filter((s) => {
		const txt = busca.toLowerCase();
		const matchBusca =
			s.produto.toLowerCase().includes(txt) ||
			s.usuario_nome.toLowerCase().includes(txt);

		return s.status === "pendente" && matchBusca;
	});

	const aprovados = solicitacoes.filter((s) => {
		const txt = busca.toLowerCase();
		const matchBusca =
			s.produto.toLowerCase().includes(txt) ||
			s.usuario_nome.toLowerCase().includes(txt);

		return s.status === "aprovado" && matchBusca;
	});


	const historico = solicitacoes.filter((s) => {
		const txt = busca.toLowerCase();
		const matchBusca =
			s.produto.toLowerCase().includes(txt) ||
			s.usuario_nome.toLowerCase().includes(txt);
		const statusLower = (s.status || "").toLowerCase();
		const matchStatus =
			filtroStatus === "todos" || filtroStatus === statusLower;
		// Inclui no histórico tudo que não for pendente nem aprovado
		return ["recusado", "finalizado", "cancelado"].includes(statusLower) && matchBusca && matchStatus;
	});

	return (
		<main style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
				<div className="container py-5">
					<div className="d-flex align-items-center justify-content-between mb-4">
						<div>
							<h1 className="fw-bold mb-1" style={{ color: "var(--primary-color)" }}>
								<i className="bi bi-list-check me-2"></i> Painel de Solicitações
							</h1>
							<p className="text-muted mb-0">Gerencie solicitações pendentes, aprovadas e histórico.</p>
						</div>
						<div className="d-none d-md-flex align-items-center gap-2">
							<span className="badge rounded-pill bg-primary-subtle text-primary">
								<i className="bi bi-clock-history me-2"></i>
								{solicitacoes.length} registro(s)
							</span>
					</div>
				</div>

				{/* Notificações flutuantes modernas */}
				<ToastNotification
					notificacoes={notificacoes}
					onClose={(id) => setNotificacoes((prev) => prev.filter((n) => n.id !== id))}
				/>					<ul className="nav nav-tabs mb-4 justify-content-center">
						<li className="nav-item">
							<button
								className={`nav-link ${abaAtiva === "pendentes" ? "active fw-bold" : ""}`}
								onClick={() => setAbaAtiva("pendentes")}
							>
								Pendentes
							</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link ${abaAtiva === "aprovados" ? "active fw-bold" : ""}`}
								onClick={() => setAbaAtiva("aprovados")}
							>
								Aprovados
							</button>
						</li>
						<li className="nav-item">
							<button
								className={`nav-link ${abaAtiva === "historico" ? "active fw-bold" : ""}`}
								onClick={() => setAbaAtiva("historico")}
							>
								Histórico
							</button>
						</li>
					</ul>

					<div className="row mb-4">
						<div className="col-md-6">
							<input
								type="text"
								className="form-control form-control-lg modern-input"
								placeholder="Buscar por produto ou solicitante..."
								value={busca}
								onChange={(e) => setBusca(e.target.value)}
							/>
						</div>

						{abaAtiva === "historico" && (
							<div className="col-md-4">
								<select
									className="form-select form-select-lg modern-input"
									value={filtroStatus}
									onChange={(e) => setFiltroStatus(e.target.value)}
								>
									<option value="todos">Todos os Status</option>
									<option value="recusado">Recusados</option>
									<option value="finalizado">Finalizados</option>
									<option value="cancelado">Cancelados</option>
								</select>
							</div>
						)}
					</div>


			{abaAtiva === "pendentes" && (
				<div>
					{pendentes.length === 0 ? (
						<div className="alert alert-secondary text-center">
							Nenhuma solicitação pendente.
						</div>
					) : (
						<div className="card border-0 shadow rounded-4 overflow-hidden">
							<div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
								<div className="d-flex align-items-center gap-2">
									<i className="bi bi-table text-primary"></i>
									<span className="fw-semibold">Solicitações Pendentes</span>
								</div>
								<div className="text-muted small">
									Última atualização em {new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "")}
								</div>
							</div>
							<div className="table-responsive">
								<table className="table table-hover align-middle mb-0">
								<thead className="table-gradient">
									<tr>
										<th scope="col" className="fw-semibold table-gradient">Data</th>
										<th scope="col" className="fw-semibold table-gradient">Material</th>
										<th scope="col" className="fw-semibold table-gradient">Qtd</th>
										<th scope="col" className="fw-semibold table-gradient">Área</th>
										<th scope="col" className="fw-semibold table-gradient">Solicitante</th>
										<th scope="col" className="text-center fw-semibold table-gradient">Status</th>
										<th scope="col" className="text-end fw-semibold table-gradient">Ações</th>
									</tr>
								</thead>

								<tbody>
									{pendentes.map((item) => (
										<tr key={item.id}>
											<td className="p-3">{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td className="p-3">{item.produto}</td>
											<td className="p-3">{item.quantidade}</td>
											<td className="p-3">{item.area}</td>
											<td className="p-3">{item.usuario_nome}</td>

											<td className="text-center p-3">
												<span className={`badge-status badge-warning`}>{item.status.toUpperCase()}</span>
											</td>

											<td className="text-end p-3">
												<div className="d-inline-flex gap-2 align-items-center">
													<button
														className="btn btn-success btn-sm"
														title="Aprovar"
														onClick={() => abrirModalAprovar(item)}
													>
														<i className="bi bi-check-lg"></i>
													</button>
													<button
														className="btn btn-outline-danger btn-sm"
														title="Recusar"
														onClick={() => abrirModal(item)}
													>
														<i className="bi bi-x-lg"></i>
													</button>
													<button
														className="btn btn-primary btn-sm"
														title="Ver detalhes"
														onClick={() => verDetalhes(item)}
													>
														<i className="bi bi-eye"></i>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			)}

			{abaAtiva === "aprovados" && (
				<div>
					{aprovados.length === 0 ? (
						<div className="alert alert-secondary text-center">
							Nenhuma solicitação pendente.
						</div>
					) : (
						<div className="card border-0 shadow rounded-4 overflow-hidden">
							<div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
								<div className="d-flex align-items-center gap-2">
									<i className="bi bi-table text-primary"></i>
									<span className="fw-semibold">Solicitações Aprovadas</span>
								</div>
								<div className="text-muted small">
									Última atualização em {new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "")}
								</div>
							</div>
							<div className="table-responsive">
								<table className="table table-hover align-middle mb-0">
								<thead className="table-gradient">
									<tr>
										<th scope="col" className="fw-semibold table-gradient">Data</th>
										<th scope="col" className="fw-semibold table-gradient">Material</th>
										<th scope="col" className="fw-semibold table-gradient">Qtd</th>
										<th scope="col" className="fw-semibold table-gradient">Área</th>
										<th scope="col" className="fw-semibold table-gradient">Solicitante</th>
										<th scope="col" className="text-center fw-semibold table-gradient">Status</th>
										<th scope="col" className="text-end fw-semibold table-gradient">Ações</th>
									</tr>
								</thead>

								<tbody>
									{aprovados.map((item) => (
										<tr key={item.id}>
											<td className="p-3">{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td className="p-3">{item.produto}</td>
											<td className="p-3">{item.quantidade}</td>
											<td className="p-3">{item.area}</td>
											<td className="p-3">{item.usuario_nome}</td>

											<td className="text-center p-3">
												<span className={`badge-status badge-success`}>{item.status.toUpperCase()}</span>
											</td>

											<td className="text-end p-3">
												<div className="d-inline-flex gap-2 align-items-center">
													<button
														className="btn btn-secondary btn-sm"
														onClick={() => abrirModalFinalizar(item)}
														title="Finalizar"
													>
														<i className="bi bi-box-seam"></i>
													</button>
													<button
														className="btn btn-primary btn-sm"
														title="Ver detalhes"
														onClick={() => verDetalhes(item)}
													>
														<i className="bi bi-eye"></i>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			)}

			{abaAtiva === "historico" && (
				<div>
					{historico.length === 0 ? (
						<div className="alert alert-secondary text-center">
							Nenhum histórico encontrado com os filtros.
						</div>
					) : (
						<div className="card border-0 shadow rounded-4 overflow-hidden">
							<div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
								<div className="d-flex align-items-center gap-2">
									<i className="bi bi-table text-primary"></i>
									<span className="fw-semibold">Histórico</span>
								</div>
								<div className="text-muted small">
									Última atualização em {new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "")}
								</div>
							</div>
							<div className="table-responsive">
								<table className="table table-hover align-middle mb-0">
								<thead className="table-gradient">
									<tr>
										<th scope="col" className="fw-semibold table-gradient">Data</th>
										<th scope="col" className="fw-semibold table-gradient">Material</th>
										<th scope="col" className="fw-semibold table-gradient">Qtd</th>
										<th scope="col" className="fw-semibold table-gradient">Solicitante</th>
										<th scope="col" className="text-center fw-semibold table-gradient">Status</th>
										<th scope="col" className="text-end fw-semibold table-gradient">Ações</th>
									</tr>
								</thead>

								<tbody>
									{historico.map((item) => (
										<tr key={item.id}>
											<td className="p-3">{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td className="p-3">{item.produto}</td>
											<td className="p-3">{item.quantidade}</td>
											<td className="p-3">{item.usuario_nome}</td>
											<td className="text-center p-3">
												<span
													className={`badge-status ${item.status === "aprovado"
														? "badge-success"
														: item.status === "recusado"
															? "badge-danger"
															: item.status === "finalizado"
																? "badge-success"
																: item.status === "cancelado"
																	? "badge-secondary"
																	: "badge-warning"}`}
												>
													{item.status.toUpperCase()}
												</span>
											</td>

											<td className="text-end p-3">
												<div className="d-inline-flex gap-2 align-items-center">
													<button
														className="btn btn-primary btn-sm"
														title="Ver detalhes"
														onClick={() => verDetalhes(item)}
													>
														<i className="bi bi-eye"></i>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			)}

			<ModalAprovar
				solicitacao={modalAprovarAberto ? selecionada : null}
				onClose={() => {
					setModalAprovarAberto(false);
					setSelecionada(null);
				}}
				onConfirm={confirmarAprovacao}
			/>

			<ModalRecusar
				solicitacao={modalAberto ? selecionada : null}
				onClose={() => {
					setModalAberto(false);
					setSelecionada(null); // Limpa a seleção ao fechar
				}}
				onConfirm={confirmarRecusa}
				observacao={observacao}
				setObservacao={setObservacao}
			/>

			<ModalFinalizar
				solicitacao={modalFinalizarAberto ? selecionada : null}
				onClose={() => {
					setModalFinalizarAberto(false);
					setSelecionada(null);
				}}
				onConfirm={confirmarFinalizacao}
			/>

			<ModalDetalhes
				solicitacao={!modalAberto && !modalAprovarAberto && !modalFinalizarAberto && selecionada ? selecionada : null}
				onClose={() => setSelecionada(null)}
				isAdmin={true}
			/>
			</div>
		</main>
	);
}