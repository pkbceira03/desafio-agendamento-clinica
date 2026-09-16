import { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/api';
import { CustomCalendar } from '../components/CustomCalendar';
import { TimeSlotList } from '../components/TiemSlotList';
import { BookingModal } from '../components/BookingModal';

export function Home() {
  const [date, setDate] = useState<string>('');
  const [slots, setSlots] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [refreshKey, setRefreshKey] = useState(0);

  const carregarPanorama = () => {
    api.get('/appointments').then((response) => {
      const dates = response.data.map((app: { date: string }) => app.date.split('T')[0]);
      setBookedDates([...new Set(dates)] as string[]);
    }).catch(() => console.error('Erro ao buscar panorama.'));
  };

  useEffect(() => {
    carregarPanorama();
  }, []);

  useEffect(() => {
    if (!date) return;

    async function fetchAvailableSlots() {
      setLoading(true);
      setMessage(null);
      try {
        const response = await api.get(`/available`, { params: { date } });
        if (response.data.available === false) {
          setMessage(response.data.message);
          setSlots([]);
        } else {
          setSlots(response.data.slots || []);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data?.error || 'Erro ao buscar horários.');
        } else {
          setMessage('Erro inesperado ao buscar horários.');
        }
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableSlots();
  }, [date, refreshKey]);

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleConfirmarAgendamento = async (name: string, phone: string) => {
    if (!date || !selectedTime) return;

    setIsSubmitting(true);
    try {
      await api.post('/appointments', {
        name,
        phone,
        date,
        time: selectedTime,
      });

      setIsModalOpen(false);
      setShowSuccessPopup(true);
      
      carregarPanorama(); 
      setRefreshKey(prev => prev + 1); 
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        setSelectedTime(null);
      }, 3000);
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || 'Erro ao realizar agendamento.');
      } else {
        alert('Erro inesperado ao realizar agendamento.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-8 border border-slate-100 grid md:grid-cols-2 gap-8 relative">
        
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agendamento</h1>
            <p className="text-sm text-slate-500 mt-1">Escolha uma data para visualizar os horários.</p>
          </div>
          <CustomCalendar onSelectDate={setDate} bookedDates={bookedDates} />
        </div>

        <div className="flex flex-col gap-4">
          {date ? (
            <TimeSlotList
              loading={loading}
              slots={slots}
              message={message}
              selectedTime={selectedTime}
              onSelectTime={handleTimeClick}
            />
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 text-slate-400 text-sm text-center">
              Selecione uma data no calendário ao lado.
            </div>
          )}
        </div>
        
        {showSuccessPopup && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg z-40 flex items-center gap-2 animate-in slide-in-from-top-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-semibold">Agendamento confirmado com sucesso!</span>
          </div>
        )}

      </div>

      {isModalOpen && selectedTime && (
        <BookingModal
          date={date}
          time={selectedTime}
          isSubmitting={isSubmitting}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleConfirmarAgendamento}
        />
      )}
    </div>
  );
}

export default Home;