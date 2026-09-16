import { prisma } from '../database';

interface CreateAppointmentDTO {
  name: string;
  phone: string;
  date: string; 
  time: string; 
}

export class AppointmentRepository {
  async findByDateAndStartTime(date: string, time: string) {
    const parsedDate = new Date(date + 'T00:00:00.000Z');
    return await prisma.appointment.findFirst({
      where: {
        date: parsedDate,
        time,
      },
    });
  }

  async findByDate(date: string) {
    const parsedDate = new Date(date + 'T00:00:00.000Z');
    return await prisma.appointment.findMany({
      where: {
        date: parsedDate,
      },
    });
  }

  async findAll() {
    return await prisma.appointment.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async create(data: CreateAppointmentDTO) {
    const parsedDate = new Date(data.date + 'T00:00:00.000Z');
    return await prisma.appointment.create({
      data: {
        name: data.name,
        phone: data.phone,
        date: parsedDate,
        time: data.time,
      },
    });
  }
}