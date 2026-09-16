import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { checkIfIsHoliday } from '../utils/isHoliday';

export class AppointmentService {
  private appointmentRepository = new AppointmentRepository();

  async getAvailableSlots(dateString: string) {
    const now = new Date();
    const yearNow = now.getFullYear();
    const monthNow = String(now.getMonth() + 1).padStart(2, '0');
    const dayNow = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yearNow}-${monthNow}-${dayNow}`;
    
    if (dateString < todayStr) {
      return { available: false, message: 'Não é permitido consultar ou agendar datas no passado.' };
    }

    const parts = dateString.split('-');
    const year = parts[0] ? parseInt(parts[0], 10) : new Date().getFullYear();
    const month = parts[1] ? parseInt(parts[1], 10) : 1;
    const day = parts[2] ? parseInt(parts[2], 10) : 1;

    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { available: false, message: 'Não há atendimento aos finais de semana.' };
    }

    const isHoliday = await checkIfIsHoliday(dateString);
    if (isHoliday) {
      return { available: false, message: 'Não há atendimento em feriados nacionais.' };
    }

    const workHours = [
      '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', 
      '16:00', '17:00', '18:00'
    ];

    const bookedAppointments = await this.appointmentRepository.findByDate(dateString);
    const bookedTimes = bookedAppointments.map((app) => app.time);

    const availableTimes = workHours.filter((time) => !bookedTimes.includes(time));

    return { available: true, slots: availableTimes };
  }

  async createAppointment(data: { name: string; phone: string; date: string; time: string }) {
    const availability = await this.getAvailableSlots(data.date);
    if (!availability.available || !availability.slots?.includes(data.time)) {
      throw new Error('Horário indisponível, data bloqueada ou inválida.');
    }

    const existing = await this.appointmentRepository.findByDateAndStartTime(data.date, data.time);
    if (existing) {
      throw new Error('Este horário já foi agendado.');
    }

    return await this.appointmentRepository.create(data);
  }

  async listAppointments() {
    return await this.appointmentRepository.findAll();
  }
}