import { describe, it, expect } from 'vitest';
import { getNationalHolidays } from '../src/services/holidayService';
import { checkIfIsHoliday } from '../src/utils/isHoliday';

describe('Holiday Integration Service', () => {
  it('deve retornar a lista de feriados nacionais de 2026', async () => {
    const holidays = await getNationalHolidays(2026);
    expect(holidays.length).toBeGreaterThan(0);
  });

  it('deve identificar corretamente um feriado nacional conhecido (ex: Confraternização Universal - 01/01)', async () => {
    const isHoliday = await checkIfIsHoliday('2026-01-01');
    expect(isHoliday).toBe(true);
  });

  it('deve retornar falso para uma data comum que nao e feriado', async () => {
    const isHoliday = await checkIfIsHoliday('2026-03-15');
    expect(isHoliday).toBe(false);
  });
});