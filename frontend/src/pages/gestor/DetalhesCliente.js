import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const DetalhesCliente = () => {
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [ativos, setAtivos] = useState([]);
    const [documentos, setDocumentos] = useState([]);

    useEffect(() => {
        // Mock data para veres o layout a funcionar agora no browser
        setCliente({ nome: "Empresa de Teste IPV", responsavel: "Daniel", email: "daniel@ipv.pt" });
        
        setAtivos([
            { id: 1, nome: "Servidor Web Principal", tipo: "Cloud", criticidade: "Alta" },
            { id: 2, nome: "PC da Administração", tipo: "Workstation", criticidade: "Média" }
        ]);

        setDocumentos([
            { id: 1, nome: "Politica_Seguranca_V1.pdf", tipo: "Política" },
            { id: 2, nome: "Relatorio_Auditoria_2026.pdf", tipo: "Relatório" }
        ]);
    }, [id]);

    if (!cliente) return <div className="text-center mt-5 text-white">A carregar detalhes...</div>;

    return (
        <div className="bg-dark min-vh-100 text-white pb-5">
            {/* Cabeçalho */}
            <header className="bg-black py-4 border-bottom border-primary mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-primary fw-bold text-uppercase small">Módulo do Gestor</span>
                        <h1 className="fw-bold mb-0">{cliente.nome}</h1>
                        <p className="small text-muted mb-0">Contacto: {cliente.email} | Responsável: {cliente.responsavel}</p>
                    </div>
                    <Link to="/gestor" className="btn btn-outline-secondary btn-sm">
                        ← Voltar ao Painel
                    </Link>
                </div>
            </header>

            <main className="container">
                {/* 📑 ABAS (TABS) DO BOOTSTRAP */}
                <ul className="nav nav-tabs mb-4" id="visonTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active text-uppercase fw-bold" id="ativos-tab" data-bs-toggle="tab" data-bs-target="#ativos-pane" type="button" role="tab">
                            💻 Ativos Tecnológicos
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link text-uppercase fw-bold" id="docs-tab" data-bs-toggle="tab" data-bs-target="#docs-pane" type="button" role="tab">
                            📁 Documentação de Suporte
                        </button>
                    </li>
                </ul>

                {/* 📦 CONTEÚDO DAS ABAS */}
                <div className="tab-content" id="visonTabsContent">
                    
                    {/* ABA 1: ATIVOS */}
                    <div className="tab-pane fade show active" id="ativos-pane" role="tabpanel">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Inventário do Cliente</h3>
                            <button className="btn btn-success fw-bold">
                                🟩 Importar Excel (.xlsx)
                            </button>
                        </div>
                        
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle border-secondary">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome do Ativo</th>
                                        <th>Tipo</th>
                                        <th>Criticidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ativos.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.id}</td>
                                            <td className="fw-bold">{a.nome}</td>
                                            <td><span className="badge bg-secondary">{a.tipo}</span></td>
                                            <td>
                                                <span className={`badge ${a.criticidade === 'Alta' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                                    {a.criticidade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ABA 2: DOCUMENTAÇÃO */}
                    <div className="tab-pane fade" id="docs-pane" role="tabpanel">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>Políticas e Relatórios</h3>
                            <button className="btn btn-primary fw-bold">
                                🟦 Carregar PDF
                            </button>
                        </div>

                        <div className="row g-3">
                            {documentos.map(doc => (
                                <div key={doc.id} className="col-md-6">
                                    <div className="card bg-secondary text-white border-0 shadow-sm p-3 d-flex flex-row align-items-center justify-content-between">
                                        <div>
                                            <h5 className="mb-1 text-truncate" style={{ maxWidth: '250px' }}>{doc.nome}</h5>
                                            <span className="small opacity-75">{doc.tipo}</span>
                                        </div>
                                        <button className="btn btn-sm btn-light">Visualizar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default DetalhesCliente;