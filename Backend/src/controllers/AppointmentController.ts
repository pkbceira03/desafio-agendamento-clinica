import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';

export class AppointmentController {
  private appointmentService = new AppointmentService();

  public getAvailable = async (req: Request, res: Response): Promise<void> => {
    try {
      const { date } = req.query;
      if (!date || typeof date !== 'string') {
        res.status(400).json({ error: 'A data é obrigatória no formato YYYY-MM-DD.' });
        return;
      }

      const result = await this.appointmentService.getAvailableSlots(date);
      res.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar horários disponíveis.';
      res.status(500).json({ error: message });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone, date, time } = req.body;

      if (!name || !phone || !date || !time) {
        res.status(400).json({ error: 'Todos os campos (name, phone, date, time) são obrigatórios.' });
        return;
      }

      const newAppointment = await this.appointmentService.createAppointment({ name, phone, date, time });
      res.status(201).json(newAppointment);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar agendamento.';
      res.status(400).json({ error: message });
    }
  };

  public list = async (req: Request, res: Response): Promise<void> => {
    try {
      const appointments = await this.appointmentService.listAppointments();
      res.json(appointments);
    } catch {
      res.status(500).json({ error: 'Erro ao listar agendamentos.' });
    }
  };
}