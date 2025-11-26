"use client"

import Link from 'next/link'
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react";

export default function Navbar() {
    const [dadosUsuario, setDadosUsuario] = useState(null);

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
        
        // Carrega dados do usuário do localStorage
        const dadosString = localStorage.getItem("dadosUsuario");
        if (dadosString) {
            try {
                const dados = JSON.parse(dadosString);
                setDadosUsuario(dados);
            } catch (e) {
                console.error("Erro ao parsear dadosUsuario:", e);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("dadosUsuario");
        window.location.href = "/login";
    };

    return (
        <header 
            className="shadow-sm" 
            style={{
                background: "linear-gradient(135deg, #247add 0%, #0033a0 100%)",
                padding: "1rem 0"
            }}
        >
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-between">
                    {/* Logo e Título */}
                    <Link
                        href="/"
                        className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
                    >
                        <i className="bi bi-box-seam-fill me-2 me-md-3" style={{ fontSize: "28px" }}></i>
                        <div>
                            <h4 className="mb-0 fw-bold" style={{ fontSize: "clamp(16px, 4vw, 24px)" }}>Sistema de Materiais</h4>
                            <small className="opacity-75 d-none d-sm-block">Gestão de Requisições</small>
                        </div>
                    </Link>

                    {/* Menu de navegação - Desktop */}
                    <nav className="d-none d-lg-flex gap-4 me-auto ms-5">
                        <Link href="/" className="text-white text-decoration-none d-flex align-items-center gap-2 hover-link">
                            <i className="bi bi-house-door-fill"></i>
                            <span>Início</span>
                        </Link>
                        <Link href="/solicitacao" className="text-white text-decoration-none d-flex align-items-center gap-2 hover-link">
                            <i className="bi bi-plus-circle-fill"></i>
                            <span>Nova Solicitação</span>
                        </Link>
                        <Link href="/historico" className="text-white text-decoration-none d-flex align-items-center gap-2 hover-link">
                            <i className="bi bi-clock-history"></i>
                            <span>Histórico</span>
                        </Link>
                    </nav>

                    {/* Dropdown de Navegação - Mobile */}
                    <div className="d-flex align-items-center gap-3">
                        <div className="dropdown d-lg-none">
                            <button
                                className="btn btn-outline-light fw-semibold dropdown-toggle d-flex align-items-center gap-2"
                                type="button"
                                id="dropdownNavegacao"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ borderRadius: "8px" }}
                            >
                                <i className="bi bi-list"></i>
                                <span className="d-none d-sm-inline">Menu</span>
                            </button>
                            <ul 
                                className="dropdown-menu shadow-lg border-0" 
                                aria-labelledby="dropdownNavegacao"
                                style={{
                                    background: "linear-gradient(135deg, #247add 0%, #0033a0 100%)",
                                    minWidth: "220px"
                                }}
                            >
                                <li>
                                    <Link href="/" className="dropdown-item text-white menu-item-hover">
                                        <i className="bi bi-house-door me-2"></i>
                                        Início
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/solicitacao" className="dropdown-item text-white menu-item-hover">
                                        <i className="bi bi-plus-circle me-2"></i>
                                        Nova Solicitação
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/historico" className="dropdown-item text-white menu-item-hover">
                                        <i className="bi bi-clock-history me-2"></i>
                                        Histórico
                                    </Link>
                                </li>
                               
                            </ul>
                        </div>

                        {/* Perfil do usuário */}
                        {dadosUsuario && (
                            <div className="dropdown">
                                <a
                                    href="#"
                                    className="d-flex align-items-center text-white text-decoration-none dropdown-toggle gap-2"
                                    id="dropdownUser1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="d-none d-md-block text-end me-2">
                                        <div className="fw-semibold">{dadosUsuario.usuario.nome}</div>
                                        <small className="opacity-75">
                                            {dadosUsuario.usuario.tipo === "admin" ? "Administrador" : "Usuário"}
                                        </small>
                                    </div>
                                    <div 
                                        className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <i className="bi bi-person-fill" style={{ fontSize: "24px", color: "#247add" }}></i>
                                    </div>
                                </a>
                                <ul
                                    className="dropdown-menu dropdown-menu-end shadow"
                                    aria-labelledby="dropdownUser1"
                                    style={{ minWidth: "280px" }}
                                >
                                    <li className="px-3 py-2 border-bottom">
                                        <div className="text-muted small mb-1">Informações do Usuário</div>
                                        <div className="fw-bold">{dadosUsuario.usuario.nome}</div>
                                        <div className="text-muted small">{dadosUsuario.usuario.email}</div>
                                        <div className="mt-1">
                                            <span className="badge bg-primary">
                                                {dadosUsuario.usuario.tipo === "admin" ? "Administrador" : "Usuário"}
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="dropdown-item text-danger mt-2" href="#" onClick={handleLogout}>
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Sair
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-link {
                    transition: opacity 0.2s ease;
                }
                .hover-link:hover {
                    opacity: 0.8;
                }
                .menu-item-hover {
                    transition: background-color 0.2s ease;
                }
                .menu-item-hover:hover {
                    background-color: rgba(255, 255, 255, 0.2) !important;
                }
            `}</style>
        </header>
    );
}