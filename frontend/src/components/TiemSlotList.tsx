interface TimeSlotListProps {
  loading: boolean;
  slots: string[];
  message: string | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export function TimeSlotList({
  loading,
  slots,
  message,
  selectedTime,
  onSelectTime,
}: TimeSlotListProps) {
  if (loading) {
    return (
      <div className="text-center py-6 text-slate-500 animate-pulse">
        Carregando horários disponíveis...
      </div>
    );
  }

  if (message) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm text-center">
        {message}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        Nenhum horário disponível para esta data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-slate-700">Horários disponíveis:</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}