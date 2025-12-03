"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";

export default function DashboardAdmin() {
	const router = useRouter();
	const [dadosUsuario, setDadosUsuario] = useState(null);

	useEffect(() => {
		const dadosString = localStorage.getItem("dadosUsuario");
		if (!dadosString) {
			router.push("/login");
			return;
		}
		try {
			const dados = JSON.parse(dadosString);
			if (dados.usuario.tipo === "comum") {
				router.push("/");
				return;
			}
			setDadosUsuario(dados);
		} catch (e) {
			console.error("Erro ao parsear dadosUsuario do localStorage:", e);
			router.push("/login");
		}
	}, []);

	

	if (dadosUsuario === null || dadosUsuario.usuario.tipo !== "admin") {
		return <p>Carregando...</p>;
	}

	return (
		<main style={{ flex: "1", backgroundColor: "var(--background-color)", minHeight: "91.3vh" }}>
			<div className="container py-5">

				{/* Hero Section */}
				<div className="hero-section rounded-4 p-4 p-md-5 mb-5">
					<div className="row align-items-center">
						<div className="col-md-8">
							<div className="d-flex align-items-center mb-3">
								<div className="hero-icon me-3">
									<i className="bi bi-speedometer2"></i>
								</div>
								<div>
									<h1 className="fw-bold mb-1" style={{ fontSize: "clamp(24px, 5vw, 42px)", color: "var(--primary-color)" }}>
										Painel do Administrador
									</h1>
									<p className="text-muted mb-0">Bem-vindo ao centro de controle</p>
								</div>
							</div>
							<p className="fs-5 mb-0 text-secondary">
								Gerencie solicitações, controle o estoque e acompanhe métricas do sistema.
							</p>
						</div>
					</div>
				</div>

				{/* Cards de Acesso Rápido */}
				<div className="row g-4">

					<div className="col-12 col-md-6 col-lg-4">
						<div className="admin-card shadow rounded-4 h-100 d-flex flex-column">
							<div
								className="admin-card-header d-flex align-items-center justify-content-center p-4"
								style={{
									background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
									borderTopLeftRadius: "1rem",
									borderTopRightRadius: "1rem",
									minHeight: "120px"
								}}
							>
								<i
									className="bi bi-list-check"
									style={{ fontSize: "4rem", color: "white" }}
								></i>
							</div>
							<div className="admin-card-body flex-grow-1 d-flex flex-column justify-content-between p-4" style={{ background: "white" }}>
								<div>
									<h5 className="fw-bold mb-3" style={{ color: "var(--primary-color)" }}>Painel de Solicitações</h5>
									<p className="text-secondary mb-4">
										Gerencie aprovações e recusas de pedidos dos usuários.
									</p>
								</div>
								<Link href="/administracao/painelSolicitacao">
									<button
										className="btn fw-bold rounded-pill px-4 w-100 admin-button"
										style={{
											background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
											color: "white",
											border: "none"
										}}
									>
										Acessar Painel
									</button>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-12 col-md-6 col-lg-4">
						<div className="admin-card shadow rounded-4 h-100 d-flex flex-column">
							<div
								className="admin-card-header d-flex align-items-center justify-content-center p-4"
								style={{
									background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
									borderTopLeftRadius: "1rem",
									borderTopRightRadius: "1rem",
									minHeight: "120px"
								}}
							>
								<i
									className="bi bi-box-seam"
									style={{ fontSize: "4rem", color: "white" }}
								></i>
							</div>
							<div className="admin-card-body flex-grow-1 d-flex flex-column justify-content-between p-4" style={{ background: "white" }}>
								<div>
									<h5 className="fw-bold mb-3" style={{ color: "var(--primary-color)" }}>Estoque</h5>
									<p className="text-secondary mb-4">
										Acompanhe o status e disponibilidade dos itens no estoque.
									</p>
								</div>
								<Link href="/administracao/estoque">
									<button
										className="btn fw-bold rounded-pill px-4 w-100 admin-button"
										style={{
											background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
											color: "white",
											border: "none"
										}}
									>
										Acessar Estoque
									</button>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-12 col-md-6 col-lg-4">
						<div className="admin-card shadow rounded-4 h-100 d-flex flex-column">
							<div
								className="admin-card-header d-flex align-items-center justify-content-center p-4"
								style={{
									background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
									borderTopLeftRadius: "1rem",
									borderTopRightRadius: "1rem",
									minHeight: "120px"
								}}
							>
								<i
									className="bi bi-graph-up"
									style={{ fontSize: "4rem", color: "white" }}
								></i>
							</div>
							<div className="admin-card-body flex-grow-1 d-flex flex-column justify-content-between p-4" style={{ background: "white" }}>
								<div>
									<h5 className="fw-bold mb-3" style={{ color: "var(--primary-color)" }}>Relatórios</h5>
									<p className="text-secondary mb-4">
										Visualize métricas e dados do sistema de requisições.
									</p>
								</div>
								<Link href="/administracao/relatorio">
									<button
										className="btn fw-bold rounded-pill px-4 w-100 admin-button"
										style={{
											background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
											color: "white",
											border: "none"
										}}
									>
										Acessar Relatório
									</button>
								</Link>
							</div>
						</div>
					</div>

				</div>

			</div>
		</main>
	);
}
