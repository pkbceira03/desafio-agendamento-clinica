import axios from 'axios';

export interface PublicHoliday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

export async function getNationalHolidays(year: number = 2026): Promise<PublicHoliday[]> {
  try {
    const response = await axios.get<PublicHoliday[]>(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/BR`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar feriados nacionais da API externa:', error);
    return [];
  }
}