"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ModalDetalhes from "@/components/ModalDetalhes";
import ModalRecusar from "@/components/ModalRecusar";


export default function PainelSolicitacao() {
	const router = useRouter();

	const [abaAtiva, setAbaAtiva] = useState("pendentes");
	const [solicitacoes, setSolicitacoes] = useState([]); // array normalizado para exibição
	const [selecionada, setSelecionada] = useState(null);
	const [mensagemSucesso, setMensagemSucesso] = useState("");
	const [mensagemErro, setMensagemErro] = useState("");
	const [modalAberto, setModalAberto] = useState(false);
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

			fetch("http://localhost:3001/api/solicitacoes", {
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

	const atualizarStatus = async (id, novoStatus, obs = "") => {
		const backup = solicitacoes;

		setSolicitacoes((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, status: novoStatus, observacao: obs } : item
			)
		);

		if (!dadosUsuario?.token) {
			setMensagemSucesso("Usuário não autenticado.");
			setTimeout(() => setMensagemSucesso(""), 3000);
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
				const errorText = await res.text();
				if (res.status === 400 && errorText.includes("estoque insuficiente")) {
					throw new Error("Estoque insuficiente para atender a solicitação.");
				}
				throw new Error(errorText || "Erro ao atualizar solicitação.");
			}

			setMensagemSucesso(`Solicitação ${novoStatus.toLowerCase()} com sucesso!`);
			setTimeout(() => setMensagemSucesso(""), 3000);
		} catch (error) {
			console.error("Falha ao atualizar status:", error);
			// Reverte para o estado anterior em caso de erro
			setSolicitacoes(backup);

			// Trata mensagens de erro que vêm como JSON stringificado
			let mensagemAmigavel = "Erro ao atualizar solicitação.";
			try {
				const errorObj = JSON.parse(error.message);
				mensagemAmigavel = errorObj.mensagem || errorObj.erro || mensagemAmigavel;
			} catch {
				mensagemAmigavel = error.message || mensagemAmigavel;
			}

			setMensagemErro(mensagemAmigavel);
			setTimeout(() => setMensagemErro(""), 3000);
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

	const confirmarRecusa = () => {
		if (selecionada) {
			atualizarStatus(selecionada.id, "recusado", observacao);
		}
		setModalAberto(false);
		setSelecionada(null); // Limpa a seleção ao confirmar
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
		const statusLower = s.status.toLowerCase(); // Pendente, Aprovado, Recusado, Finalizado, Cancelado
		const matchStatus =
			filtroStatus === "todos" || filtroStatus === statusLower;
		return statusLower !== "pendente" && statusLower !== "aprovado" && matchBusca && matchStatus;
	});

	return (
		<div className="container my-5">


			<div className="mb-4">
				<button
					className="btn btn-outline-dark fw-semibold px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
					style={{ borderRadius: "12px" }}
					onClick={() => router.back()}
				>
					<i className="bi bi-arrow-left"></i> Voltar
				</button>
			</div>

			<h1 className="text-center mb-4 fw-bold" style={{ color: "var(--primary-color)" }}>
				<i className="bi bi-list-check me-2"></i> Painel de Solicitações
			</h1>

			{mensagemSucesso && (
				<div className="alert alert-success text-center">{mensagemSucesso}</div>
			)}
			{mensagemErro && (
				<div className="alert alert-danger text-center">{mensagemErro}</div>
			)}

			<ul className="nav nav-tabs mb-4 justify-content-center">
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


			<div className="row g-3 mb-4">
				<div className="col-md-6">
					<input
						type="text"
						className="form-control"
						placeholder="Buscar por produto ou solicitante..."
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
				</div>


				{abaAtiva === "historico" && (
					<div className="col-md-4">
						<select
							className="form-select"
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
						<div className="table-responsive shadow-sm rounded">
							<table className="table table-hover align-middle">
								<thead className="table-dark">
									<tr>
										<th>Data</th>
										<th>Material</th>
										<th>Qtd</th>
										<th>Área</th>
										<th>Solicitante</th>

										<th>Status</th>
										<th className="text-center">Ações</th>
									</tr>
								</thead>

								<tbody>
									{pendentes.map((item) => (
										<tr key={item.id}>
											<td>{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td>{item.produto}</td>
											<td>{item.quantidade}</td>
											<td>{item.area}</td>
											<td>{item.usuario_nome}</td>

											<td>
												<span className="badge bg-secondary">{item.status}</span>
											</td>


											<td className="text-center">
												<div className="d-flex flex-column flex-md-row justify-content-center gap-2">


													<button
														className="btn btn-success btn-sm"
														onClick={() => atualizarStatus(item.id, "aprovado")}
													>
														<i className="bi bi-check-lg"></i>
													</button>


													<button
														className="btn btn-danger btn-sm"
														onClick={() => abrirModal(item)}
													>
														<i className="bi bi-x-lg"></i>
													</button>


													<button
														className="btn btn-info btn-sm"
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
						<div className="table-responsive shadow-sm rounded">
							<table className="table table-hover align-middle">
								<thead className="table-dark">
									<tr>
										<th>Data</th>
										<th>Material</th>
										<th>Qtd</th>
										<th>Área</th>
										<th>Solicitante</th>

										<th>Status</th>
										<th className="text-center">Ações</th>
									</tr>
								</thead>

								<tbody>
									{aprovados.map((item) => (
										<tr key={item.id}>
											<td>{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td>{item.produto}</td>
											<td>{item.quantidade}</td>
											<td>{item.area}</td>
											<td>{item.usuario_nome}</td>

											<td>
												<span className="badge bg-secondary">{item.status}</span>
											</td>


											<td className="text-center">
												<div className="d-flex flex-column flex-md-row justify-content-center gap-2">


													<button
														className="btn btn-success btn-sm"
														onClick={() => atualizarStatus(item.id, "aprovado")}
													>
														<i className="bi bi-check-lg"></i>
													</button>


													<button
														className="btn btn-danger btn-sm"
														onClick={() => abrirModal(item)}
													>
														<i className="bi bi-x-lg"></i>
													</button>


													<button
														className="btn btn-info btn-sm"
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
						<div className="table-responsive shadow-sm rounded">
							<table className="table table-hover align-middle">
								<thead className="table-dark">
									<tr>
										<th>Data</th>
										<th>Material</th>
										<th>Qtd</th>
										<th>Solicitante</th>
										<th>Data</th>
										<th>Status</th>
										<th className="text-center">Ações</th>
									</tr>
								</thead>

								<tbody>
									{historico.map((item) => (
										<tr key={item.id}>
											<td>{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td>{item.produto}</td>
											<td>{item.quantidade}</td>
											<td>{item.usuario_nome}</td>
											<td>{new Date(item.data_solicitacao).toLocaleString("pt-BR", {
												dateStyle: "short",
												timeStyle: "short",
											}).replace(",", "")}</td>
											<td>
												<span
													className={`badge ${item.status === "aprovado"
														? "bg-success"
														: item.status === "recusado"
															? "bg-danger"
															: item.status === "finalizado"
																? "bg-primary"
																: item.status === "cancelado"
																	? "bg-secondary"
																	: "bg-warning text-dark"}`}
												>
													{item.status}
												</span>
											</td>

											<td className="text-center">
												<div className="d-flex gap-2 justify-content-center">


													{item.status === "aprovado" && (
														<button
															className="btn btn-secondary btn-sm"
															onClick={() => atualizarStatus(item.id, "finalizado")}
														>
															<i className="bi bi-box-seam"></i>
														</button>
													)}


													<button
														className="btn btn-info btn-sm"
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
					)}
				</div>
			)}

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

			<ModalDetalhes
				solicitacao={!modalAberto && selecionada ? selecionada : null}
				onClose={() => setSelecionada(null)}
				isAdmin={true}
			/>

		</div>
	);
}