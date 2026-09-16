import { useState, useEffect } from 'react';
import { api } from './services/api';

export function App() {
  const [statusMessage, setStatusMessage] = useState('Carregando conexão com o backend...');

  useEffect(() => {
    api.get('/appointments')
      .then(() => setStatusMessage('Frontend conectado ao Backend com sucesso!'))
      .catch(() => setStatusMessage('Aviso: Backend offline ou indisponível.'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sistema de Agendamento Clínico</h1>
        <p className="text-sm font-medium text-blue-600 mb-6">{statusMessage}</p>
        <hr className="border-slate-100 mb-6" />
        <p className="text-slate-600">Esqueleto da aplicação SPA configurado com Tailwind CSS e variáveis de ambiente.</p>
      </div>
    </div>
  );
}

export default App;