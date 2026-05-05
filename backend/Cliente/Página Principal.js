import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap';
import { FileText, AlertTriangle, MessageSquare, ArrowUpRight } from 'lucide-react';

const DashboardPrincipal = () => {
  return (
    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <header className="mb-4">
        <h3 className="fw-bold">Dashboard</h3>
        <p className="text-muted">Bem-vindo, TechCorp Solutions</p>
      </header>

      {/* Banner de Avaliação de Risco */}
      <Card className="border-0 shadow-sm mb-4 text-white" 
            style={{ background: 'linear-gradient(90deg, #ff0080 0%, #7928ca 100%)', borderRadius: '15px' }}>
        <Card.Body className="p-4 d-flex justify-content-between align-items-center">
          <div>
            <h5>Avaliação de Risco</h5>
            <p className="small">Score de maturidade de cibersegurança</p>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: '300px' }}>
                <ProgressBar now={75} variant="light" style={{ height: '10px' }} />
              </div>
              <small>Boa postura de segurança</small>
            </div>
          </div>
          <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center" 
               style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 'bold' }}>75</div>
        </Card.Body>
      </Card>

      {/* Métricas e Áreas de Segurança */}
      <Row>
        <Col md={8}>
          <Row className="g-3 mb-4">
            <Col md={3}><StatCard label="Documentos" value="3" icon={<FileText color="#0d6efd"/>} bg="#e7f1ff"/></Col>
            <Col md={3}><StatCard label="Incidentes" value="2" icon={<AlertTriangle color="#0dcaf0"/>} bg="#e1faff"/></Col>
            <Col md={3}><StatCard label="Pedidos" value="2" icon={<MessageSquare color="#6f42c1"/>} bg="#f3e8ff"/></Col>
            <Col md={3}><StatCard label="Evolução" value="+5%" icon={<ArrowUpRight color="#d63384"/>} bg="#ffeef8"/></Col>
          </Row>
          <Card className="border-0 shadow-sm p-3">
            <h6 className="fw-bold mb-3">Áreas de Segurança</h6>
            <SecurityProgress label="Gestão de Identidade" val={90} color="black" />
            <SecurityProgress label="Segurança de Rede" val={85} color="#0dcaf0" />
            <SecurityProgress label="Proteção de Dados" val={65} color="#6f42c1" />
          </Card>
        </Col>
        <Col md={4}>
           <Card className="border-0 shadow-sm p-3">
             <h6 className="fw-bold">Ações Rápidas</h6>
             {['Ver Documentação', 'Reportar Incidente', 'Nova Questão'].map(btn => (
               <Button key={btn} variant="outline-dark" className="w-100 mb-2 text-start small">{btn}</Button>
             ))}
           </Card>
        </Col>
      </Row>
    </div>
  );
};

const StatCard = ({ label, value, icon, bg }) => (
  <Card className="border-0 shadow-sm text-center p-2">
    <div className="mx-auto p-2 rounded mb-1" style={{ backgroundColor: bg }}>{icon}</div>
    <small className="text-muted d-block">{label}</small>
    <h4 className="fw-bold mb-0">{value}</h4>
  </Card>
);

const SecurityProgress = ({ label, val, color }) => (
  <div className="mb-3">
    <div className="d-flex justify-content-between small fw-bold"><span>{label}</span><span>{val}%</span></div>
    <ProgressBar now={val} style={{ height: '6px' }} variant="custom" className={`bg-light bar-${color}`} />
  </div>
);