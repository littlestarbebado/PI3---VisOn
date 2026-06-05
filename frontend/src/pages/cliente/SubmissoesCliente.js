import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const TIPOS_INCIDENTE = ['Phishing', 'Ransomware', 'Intrusao', 'Malware', 'Exfiltracao de Dados', 'DDoS', 'Fraude', 'Outro'];
const IMPACTOS = ['Baixo', 'Medio', 'Alto', 'Critico'];

function estadoBadgeClass(estado) {
  if (estado === 'Pendente') return 'bg-danger';
  if (estado === 'Em Analise' || estado === 'Em Análise') return 'bg-primary';
  if (estado === 'Resolvido') return 'bg-success';
  return 'bg-secondary';
}

function formatarData(valor) {
  if (!valor) return 'Sem data';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return 'Sem data';
  return data.toLocaleString('pt-PT');
}

export default function SubmissoesCliente() {
  const [excelUploading, setExcelUploading] = useState(false);
  const [excelFeedback, setExcelFeedback] = useState('');
  const [excelErro, setExcelErro] = useState('');
  const [incidentes, setIncidentes] = useState([]);
  const [incidenteErro, setIncidenteErro] = useState('');
  const [incidenteFeedback, setIncidenteFeedback] = useState('');
  const [incidenteSubmitting, setIncidenteSubmitting] = useState(false);
  const [formIncidente, setFormIncidente] = useState({
    tipo: 'Phishing',
    impacto: 'Baixo',
    dataOcorrencia: '',
    descricao: '',
    acoesImediatas: ''
  });

  const zoneEstilo = {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    border: '2px dashed #d1d5db',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const carregarIncidentes = () => {
    api.get('/incidentes')
      .then(response => setIncidentes(response.data || []))
      .catch(() => setIncidenteErro('Nao foi possivel carregar os incidentes submetidos.'));
  };

  useEffect(() => {
    carregarIncidentes();
  }, []);

  const handleExcelUpload = async (event) => {
    const ficheiro = event.target.files?.[0];
    setExcelFeedback('');
    setExcelErro('');

    if (!ficheiro) return;

    setExcelUploading(true);
    setExcelFeedback('A processar Excel...');

    const formData = new FormData();
    formData.append('excel', ficheiro);

    try {
      const response = await api.post('/ativos/importar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setExcelFeedback(`Sucesso: ${response.data.total || 0} ativos importados!`);
      event.target.value = '';
    } catch (error) {
      setExcelFeedback('');
      setExcelErro(error.response?.data?.erro || 'Erro ao importar o ficheiro Excel.');
    } finally {
      setExcelUploading(false);
    }
  };

  const atualizarCampoIncidente = (campo, valor) => {
    setFormIncidente(prev => ({ ...prev, [campo]: valor }));
  };

  const submeterIncidente = async (event) => {
    event.preventDefault();
    setIncidenteErro('');
    setIncidenteFeedback('');

    if (!formIncidente.dataOcorrencia || !formIncidente.descricao.trim()) {
      setIncidenteErro('Data/hora e descricao sao obrigatorias.');
      return;
    }

    setIncidenteSubmitting(true);

    try {
      const payload = {
        ...formIncidente,
        dataOcorrencia: new Date(formIncidente.dataOcorrencia).toISOString()
      };
      const response = await api.post('/incidentes', payload);
      setIncidentes(prev => [response.data, ...prev]);
      setIncidenteFeedback('Incidente submetido com sucesso. A equipa de gestao foi notificada.');
      setFormIncidente({
        tipo: 'Phishing',
        impacto: 'Baixo',
        dataOcorrencia: '',
        descricao: '',
        acoesImediatas: ''
      });
    } catch (error) {
      setIncidenteErro(error.response?.data?.erro || 'Erro ao submeter incidente.');
    } finally {
      setIncidenteSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '1rem' }}>
      <h2 style={{ fontWeight: 800, color: '#111827', marginBottom: '0.3rem' }}>
        Submissoes e Evidencias
      </h2>
      <p style={{ color: '#4b5563', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        Envie os seus ficheiros tecnicos e relatorios de incidentes para analise da equipa de gestao.
      </p>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div style={zoneEstilo} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563eb'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}>
            <div style={{ fontSize: '2.5rem', color: '#16a34a', marginBottom: '1rem' }}>
              <i className="bi bi-file-earmark-excel"></i>
            </div>
            <h5 style={{ fontWeight: 700, color: '#1f2937' }}>Ativos Tecnologicos (Excel)</h5>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Submeta o ficheiro Excel com o inventario dos seus servidores e sistemas para bonificacao.
            </p>
            <input
              type="file"
              accept=".xlsx"
              className="form-control form-control-sm"
              disabled={excelUploading}
              onChange={handleExcelUpload}
              style={{ maxWidth: 320, margin: '0 auto', borderRadius: '8px' }}
            />
            {excelFeedback && <div className="alert alert-success py-2 small mt-3 mb-0">{excelFeedback}</div>}
            {excelErro && <div className="alert alert-danger py-2 small mt-3 mb-0">{excelErro}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155', color: '#fff', minHeight: '100%' }}>
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <h5 className="fw-bold mb-1">Reportar Incidente CNCS</h5>
                <p className="text-white-50 small mb-0">Registo estruturado com tipo, impacto, data/hora e acoes imediatas.</p>
              </div>
              <span className="badge bg-danger">Obrigatorio</span>
            </div>

            <form onSubmit={submeterIncidente} className="row g-3">
              <div className="col-md-6">
                <label className="form-label small text-white-50">Tipo</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={formIncidente.tipo}
                  onChange={event => atualizarCampoIncidente('tipo', event.target.value)}
                >
                  {TIPOS_INCIDENTE.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-white-50">Impacto</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={formIncidente.impacto}
                  onChange={event => atualizarCampoIncidente('impacto', event.target.value)}
                >
                  {IMPACTOS.map(impacto => <option key={impacto} value={impacto}>{impacto}</option>)}
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small text-white-50">Data/Hora da Ocorrencia</label>
                <input
                  type="datetime-local"
                  className="form-control bg-dark text-white border-secondary"
                  value={formIncidente.dataOcorrencia}
                  onChange={event => atualizarCampoIncidente('dataOcorrencia', event.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label small text-white-50">Descricao</label>
                <textarea
                  rows="4"
                  className="form-control bg-dark text-white border-secondary"
                  value={formIncidente.descricao}
                  onChange={event => atualizarCampoIncidente('descricao', event.target.value)}
                  placeholder="Descreva o incidente, sistemas afetados, indicadores observados e contexto operacional."
                />
              </div>

              <div className="col-12">
                <label className="form-label small text-white-50">Acoes Imediatas</label>
                <textarea
                  rows="3"
                  className="form-control bg-dark text-white border-secondary"
                  value={formIncidente.acoesImediatas}
                  onChange={event => atualizarCampoIncidente('acoesImediatas', event.target.value)}
                  placeholder="Indique contencao, isolamento, reset de credenciais, backups, comunicacoes internas, etc."
                />
              </div>

              {incidenteErro && <div className="col-12"><div className="alert alert-danger py-2 small mb-0">{incidenteErro}</div></div>}
              {incidenteFeedback && <div className="col-12"><div className="alert alert-success py-2 small mb-0">{incidenteFeedback}</div></div>}

              <div className="col-12">
                <button type="submit" className="btn btn-danger w-100 fw-bold" disabled={incidenteSubmitting}>
                  {incidenteSubmitting ? 'A submeter...' : 'Reportar Incidente CNCS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-bold">Incidentes submetidos</div>
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Impacto</th>
                <th>Data/Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {incidentes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">Ainda nao existem incidentes submetidos.</td>
                </tr>
              ) : incidentes.map(incidente => (
                <tr key={incidente.id}>
                  <td className="fw-semibold">{incidente.tipo}</td>
                  <td>{incidente.impacto}</td>
                  <td>{formatarData(incidente.dataOcorrencia)}</td>
                  <td><span className={`badge ${estadoBadgeClass(incidente.estado)}`}>{incidente.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
