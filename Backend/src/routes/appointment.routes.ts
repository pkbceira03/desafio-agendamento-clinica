import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';

const appointmentRouter = Router();
const appointmentController = new AppointmentController();

appointmentRouter.get('/available', appointmentController.getAvailable);
appointmentRouter.post('/appointments', appointmentController.create);
appointmentRouter.get('/appointments', appointmentController.list);

export { appointmentRouter };