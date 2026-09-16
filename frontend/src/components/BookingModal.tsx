import { useState } from 'react';

interface BookingModalProps {
  date: string;
  time: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (name: string, phone: string) => void;
}

export function BookingModal({ date, time, isSubmitting, onClose, onSubmit }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const dataFormatada = date.split('-').reverse().join('/');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formatted = value;
    if (value.length > 2) formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    }
    setPhone(formatted);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitos = phone.replace(/\D/g, '');
    
    if (digitos.length < 10) {
      setError('Por favor, insira um número de telefone válido com o DDD.');
      return;
    }
    onSubmit(name, phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-800">Confirmar Agendamento</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <p className="text-slate-600 text-sm">
            Deseja confirmar o agendamento para o dia <strong className="text-slate-900">{dataFormatada}</strong> às <strong className="text-slate-900">{time} horas</strong>?
          </p>
          
          <div className="flex flex-col gap-3 mt-2">
            <input
              type="text"
              placeholder="Seu Nome Completo"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            
            <div>
              <input
                type="tel"
                placeholder="Telefone (Ex: 61 99999-9999)"
                required
                value={phone}
                onChange={handlePhoneChange}
                className={`w-full p-2.5 border rounded-lg focus:ring-2 outline-none ${
                  error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}