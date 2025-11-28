"use client"

import { useState, useEffect } from "react";
import "./styles.css";

export default function ModalMaterial({ material, onClose, onConfirm, isEdit }) {
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [minimoEstoque, setMinimoEstoque] = useState("");
    const [categoria, setCategoria] = useState("");

    useEffect(() => {
        if (isEdit && material) {
            setNome(material.nome || "");
            setQuantidade(material.quantidade?.toString() || "");
            setMinimoEstoque(material.minimo_estoque?.toString() || "");
            setCategoria(material.categoria || "");
        }
    }, [isEdit, material]);

    const handleConfirm = () => {
        const dadosMaterial = {
            nome,
            quantidade: Number(quantidade),
            minimo_estoque: Number(minimoEstoque),
            categoria,
        };
        onConfirm(dadosMaterial);
    };

    const isFormValid = nome.trim() && quantidade && minimoEstoque && categoria.trim();

    return (
        <div className="modal-overlay-material" onClick={onClose}>
            <div className="modal-container-material" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-material">
                    <div className="d-flex align-items-center gap-3">
                        <div className="modal-icon-material">
                            <i className={`bi ${isEdit ? 'bi-pencil-fill' : 'bi-plus-circle-fill'}`}></i>
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold text-white">
                                {isEdit ? 'Editar Material' : 'Adicionar Material'}
                            </h4>
                            {isEdit && material && (
                                <small className="text-white opacity-75">ID: #{material.id}</small>
                            )}
                        </div>
                    </div>
                    <button className="btn-close-material" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body-material">
                    <div className="info-section-material">
                        <h6 className="section-title-material">
                            <i className="bi bi-box-seam me-2"></i>
                            Informações do Material
                        </h6>

                        <div className="form-group-material">
                            <label className="form-label-material">
                                <i className="bi bi-tag-fill me-2"></i>
                                Nome do Material
                            </label>
                            <input
                                type="text"
                                className="form-control-material"
                                placeholder="Ex: Cabo UTP"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className="form-row-material">
                            <div className="form-group-material">
                                <label className="form-label-material">
                                    <i className="bi bi-stack me-2"></i>
                                    Quantidade
                                </label>
                                <input
                                    type="number"
                                    className="form-control-material"
                                    placeholder="0"
                                    min="0"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                />
                            </div>

                            <div className="form-group-material">
                                <label className="form-label-material">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Estoque Mínimo
                                </label>
                                <input
                                    type="number"
                                    className="form-control-material"
                                    placeholder="0"
                                    min="0"
                                    value={minimoEstoque}
                                    onChange={(e) => setMinimoEstoque(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group-material">
                            <label className="form-label-material">
                                <i className="bi bi-grid-fill me-2"></i>
                                Categoria
                            </label>
                            <input
                                type="text"
                                className="form-control-material"
                                placeholder="Ex: Geral, Eletrônicos, Ferramentas"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="modal-footer-material">
                    <button className="btn-cancelar-material" onClick={onClose}>
                        <i className="bi bi-x-circle me-2"></i>
                        Cancelar
                    </button>
                    <button 
                        className="btn-confirmar-material" 
                        onClick={handleConfirm}
                        disabled={!isFormValid}
                    >
                        <i className={`bi ${isEdit ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                        {isEdit ? 'Salvar Alterações' : 'Adicionar Material'}
                    </button>
                </div>
            </div>
        </div>
    );
}
