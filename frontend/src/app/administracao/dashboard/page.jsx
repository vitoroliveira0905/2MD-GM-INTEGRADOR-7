"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


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
	}, [])


	if (dadosUsuario === null || dadosUsuario.usuario.tipo !== "admin") {
		return <p>Carregando...</p>
	}

	return (

		<div className="container py-5">
			<h1
				className="text-center mb-5 fw-bold"
				style={{
					color: "var(--primary-color)",
					letterSpacing: "1px",
				}}
			>
				<i className="bi bi-speedometer2 me-2"></i> Painel do Administrador
			</h1>

			<div className="d-flex justify-content-center flex-wrap gap-4">

				<div
					className="card shadow-lg text-center p-4 border-0"
					style={{
						width: "320px",
						borderRadius: "20px",

						transition: "all 0.3s ease",
					}}
				>
					<i
						className="bi bi-list-check mb-3"
						style={{ fontSize: "3rem", color: "#007bff" }}
					></i>
					<h5 className="fw-bold mb-3">Painel de Solicitações</h5>
					<p className="text-secondary mb-4">
						Gerencie aprovações e recusas de pedidos.
					</p>
					<Link href="/administracao/painelSolicitacao">
						<button
							className="btn fw-bold rounded-pill px-4 mt-auto"
							style={{
								backgroundColor: "#007bff",
								color: "white",
								width: "100%",
							}}
						>
							Acessar Painel
						</button>
					</Link>
				</div>

				<div
					className="card shadow-lg text-center p-4 border-0"
					style={{
						width: "320px",
						borderRadius: "20px",

						transition: "all 0.3s ease",
					}}
				>
					<i
						className="bi bi-box-seam mb-3"
						style={{ fontSize: "3rem", color: "#0d6efd" }}
					></i>
					<h5 className="fw-bold mb-3">Estoque</h5>
					<p className="text-secondary mb-4">
						Acompanhe o status e disponibilidade dos itens.
					</p>
					<Link href="/administracao/estoque">
						<button
							className="btn fw-bold rounded-pill px-4 mt-auto"
							style={{
								backgroundColor: "#0d6efd",
								color: "white",
								width: "100%",
							}}
						>
							Acessar Estoque
						</button>
					</Link>
				</div>


				<div
					className="card shadow-lg text-center p-4 border-0"
					style={{
						width: "320px",
						borderRadius: "20px",

						transition: "all 0.3s ease",
					}}
				>
					<i
						className="bi bi-graph-up mb-3"
						style={{ fontSize: "3rem", color: "#0a58ca" }}
					></i>
					<h5 className="fw-bold mb-3">Relatórios</h5>
					<p className="text-secondary mb-4">
						Visualize métricas e dados do sistema de requisições.
					</p>
					<Link href="/administracao/relatorio">
						<button
							className="btn fw-bold rounded-pill px-4 mt-auto"
							style={{
								backgroundColor: "#0d6efd",
								color: "white",
								width: "100%",
							}}
						>
							Acessar Relatório
						</button>
					</Link>
				</div>



			</div>

			<style jsx>{`
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2);
        }
        button:hover {
          opacity: 0.9;
        }
      `}</style>
		</div>
	);
}
