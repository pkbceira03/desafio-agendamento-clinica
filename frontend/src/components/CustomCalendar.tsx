import { useState } from 'react';

interface CustomCalendarProps {
  onSelectDate: (date: string) => void;
  bookedDates: string[]; 
}

export function CustomCalendar({ onSelectDate, bookedDates }: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    setSelected(dateString);
    onSelectDate(dateString);
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-slate-700 font-bold">&lt;</button>
        <span className="font-semibold text-slate-800">{monthNames[month]} {year}</span>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-slate-700 font-bold">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="p-2"></div>
        ))}
        {days.map((day) => {
          const formattedMonth = String(month + 1).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const dateString = `${year}-${formattedMonth}-${formattedDay}`;
          
          const isSelected = selected === dateString;
          const hasAppointments = bookedDates.includes(dateString);
          const isPast = new Date(dateString) < new Date(new Date().toISOString().split('T')[0]);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isPast}
              className={`p-2 rounded-md text-sm relative transition-all
                ${isPast ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-blue-100 text-slate-700'}
                ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700 font-bold' : ''}
              `}
            >
              {day}
              {hasAppointments && !isSelected && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}