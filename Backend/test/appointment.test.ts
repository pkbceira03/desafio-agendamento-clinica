import { describe, it, expect } from 'vitest';
import { AppointmentService } from '../src/services/AppointmentService';

describe('Appointment Service Logic', () => {
  const appointmentService = new AppointmentService();

  it('deve bloquear agendamentos em finais de semana (ex: Sábado)', async () => {
    const result = await appointmentService.getAvailableSlots('2026-10-31');
    expect(result.available).toBe(false);
    expect(result.message).toContain('finais de semana');
  });

  it('deve bloquear agendamentos em feriados nacionais (ex: 01 de Janeiro)', async () => {
    const result = await appointmentService.getAvailableSlots('2026-12-25');
    expect(result.available).toBe(false);
    expect(result.message).toContain('feriados nacionais');
  });

  it('deve listar os horários disponíveis das 08:00 às 18:00 em um dia útil normal', async () => {
    const result = await appointmentService.getAvailableSlots('2026-12-09');
    expect(result.available).toBe(true);
    if (result.available && result.slots) {
      expect(result.slots).toContain('08:00');
      expect(result.slots).toContain('18:00');
      expect(result.slots.length).toBe(11); 
    }
  });
});