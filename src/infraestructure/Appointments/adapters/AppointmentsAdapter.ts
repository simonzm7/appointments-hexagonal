import { HttpStatus, Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { Appointments } from "../DBEntities/appointment.entity";

@Injectable()
export class AppointmentAdapter implements AppointmentRepository {
    constructor(private readonly appoimentDBRepository: AppointmentDBRepository,
        private readonly exceptionRepository: ExceptionRepository) { }
    createAppointment = async (appointment: AppointmentModel) => {
        await this.appoimentDBRepository.createAppointment(appointment);
    }
    listAppointments = async (parameters: {}): Promise<Appointments[]> => {
        return await this.appoimentDBRepository.listAppointments(parameters);
    }
    takeAppointment = async (appointment: Appointments, user: User) => {
        appointment.appointmentStatus = 1;
        appointment.idUser = user.userId;
        await this.appoimentDBRepository.putAppointment(appointment, ActionType.Take, user);
    }

    cancelAppointment = async (appointment: Appointments, user: User) => {
        if (appointment.appointmentStatus < 2) {
            appointment.appointmentStatus = 2;
            await this.appoimentDBRepository.putAppointment(appointment, ActionType.Cancel, user);
        }
        else
            this.exceptionRepository.createException('Cita ya cancelada', HttpStatus.BAD_REQUEST);
    }
    cancelAppointmentWithoutUser = async (appointment: Appointments) => {
        if (appointment.appointmentStatus < 2) {
            appointment.appointmentStatus = 2;
            await this.appoimentDBRepository.putAppointment(appointment, ActionType.Cancel, null)
        }
        else
            this.exceptionRepository.createException('Cita ya cancelada', HttpStatus.BAD_REQUEST);
    }
    deleteAppointment = async (appointmentId: number) => {
        await this.appoimentDBRepository.findAppointmentByIdAndDelete(appointmentId);
    }
}