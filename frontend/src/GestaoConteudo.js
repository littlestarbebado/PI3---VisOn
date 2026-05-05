import React, { useState } from 'react';

const GestaoConteudo = () => {
  // Estado para gerir a lista de valores dinamicamente
  const [valores, setValores] = useState([
    { id: 1, titulo: 'Confiança', descricao: 'Descrição do valor' },
    { id: 2, titulo: 'Excelência', descricao: 'Descrição do valor' },
    { id: 3, titulo: 'Inovação', descricao: 'Descrição do valor' },
    { id: 4, titulo: 'Responsabilidade', descricao: 'Descrição do valor' },
  ]);

  const adicionarValor = () => {
    const novoId = valores.length + 1;
    setValores([...valores, { id: novoId, titulo: '', descricao: '' }]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-8 font-sans">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Conteúdos</h1>
        <p className="text-gray-500">Gerir conteúdos do website institucional</p>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex space-x-2">
        <button className="rounded-md bg-white px-4 py-1.5 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-200">Empresa</button>
        <button className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">Serviços</button>
        <button className="rounded-md px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100">Artigos</button>
      </div>

      {/* Main Content Box */}
      <div className="max-w-4xl rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">Informações da Empresa</h2>

        <div className="space-y-6">
          {/* Missão */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Missão</label>
            <textarea 
              className="w-full rounded-lg border-none bg-gray-50 p-4 focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          {/* Visão */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Visão</label>
            <textarea 
              className="w-full rounded-lg border-none bg-gray-50 p-4 focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          {/* Valores Section */}
          <div>
            <label className="mb-4 block text-sm font-medium text-gray-700">Valores</label>
            
            <div className="space-y-4">
              {valores.map((valor) => (
                <div key={valor.id} className="rounded-xl border border-gray-100 p-4">
                  <input 
                    type="text"
                    placeholder={valor.titulo || "Título do valor"}
                    className="mb-2 w-full border-none bg-gray-50 p-3 text-sm font-medium text-gray-600 rounded-md"
                  />
                  <input 
                    type="text"
                    placeholder="Descrição do valor"
                    className="w-full border-none bg-gray-50 p-3 text-sm text-gray-400 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 space-y-4">
            <button 
              onClick={adicionarValor}
              className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span className="mr-2 text-lg">+</span> Adicionar Valor
            </button>

            <button className="rounded-lg bg-[#0a0c14] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-black">
              Guardar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestaoConteudo;