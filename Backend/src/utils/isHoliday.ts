import { getNationalHolidays } from '../services/holidayService';

export async function checkIfIsHoliday(dateString: string): Promise<boolean> {
  const yearStr = dateString.substring(0, 4);
  const year = parseInt(yearStr, 10);

  const holidays = await getNationalHolidays(year);

  const isHoliday = holidays.some((holiday) => holiday.date === dateString);

  return isHoliday;
}