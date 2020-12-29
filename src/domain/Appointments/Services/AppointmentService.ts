import { HttpStatus, Injectable } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AppointmentModel } from "../Model/AppointmentModel";
import { AppointmentSelectorModel } from "../Model/AppointmentSelectorModel";
import { AppointmentRepository } from "../Repository/AppointmentRepository";
import { AppointmentValidationRepository } from "../Repository/AppointmentValidationRepository";


@Injectable()
export class AppointmentService {
    constructor(
        private readonly appointmentRepository: AppointmentRepository,
        private readonly verifyAppointment: AppointmentValidationRepository,
        private readonly exceptionRepository: ExceptionRepository,
        private readonly userRepository: DBRepository
    ) { }

    ExecuteCreate = async (appointment: AppointmentModel) => {
        if (!(await this.verifyAppointment.VerifyIfDoctorHaveAppointment(appointment.getDoctorId, appointment.DateTime))) {
            if (await this.verifyAppointment.VerifyRole(appointment.getDoctorId))
                await this.appointmentRepository.createAppointment(appointment);
            else
                this.exceptionRepository.createException('No puedes crear una cita', HttpStatus.UNAUTHORIZED);
        }
        else
            this.exceptionRepository.createException('Solo puedes crear una cita cada hora', HttpStatus.BAD_REQUEST);
    }
    ExecuteList = async (): Promise<Appointments[]> => {
        return await this.appointmentRepository.listAppointments({});
    }

    ExecuteSelector = async (selectorModel: AppointmentSelectorModel) => {
        const appointment: any = await this.verifyAppointment.VerifyAppointmentStatus(selectorModel.getAppointmentId, selectorModel.getAppointmentDate);
        if (appointment && typeof (appointment.costappointment) === 'number') {
            const user: any = await this.verifyAppointment.VerifyIfCustomerHaveBalance(selectorModel.getUserId, appointment.costappointment);
            if (user && typeof (user.dni) === 'string') {
                const status = this.verifyAppointment.VerifyDNI(user.dni, selectorModel.getWeekDay);
                if (status) {
                    this.appointmentRepository.takeAppointment(appointment, user);
                }
                else
                    this.exceptionRepository.createException('No te encuentras en día pico y cédula', HttpStatus.BAD_REQUEST);
            }
            else
                this.exceptionRepository.createException('No tienes saldo disponible', HttpStatus.BAD_REQUEST);
        }
        else
            this.exceptionRepository.createException('La cita no se encuentra disponible', HttpStatus.BAD_REQUEST);
    }

    ExecuteCanceller = async (idAppointment: number, userId: number)=> {
        const AppointmentUser: Appointments | boolean = await this.verifyAppointment.VerifyAppointmentByIdsAndReturn(idAppointment, userId);
        if (!(typeof (AppointmentUser) === 'boolean')) {
            const user: User = await this.userRepository.findOneById(userId);
            if (user)
                this.appointmentRepository.cancelAppointment(AppointmentUser, user);
            else
                this.exceptionRepository.createException('Usuario no existente', HttpStatus.BAD_REQUEST);
        }
        else {
            const Appointment: Appointments | boolean = await this.verifyAppointment.VerifyAppointmentByIdAndReturn(idAppointment);
            if (!(typeof (Appointment) === 'boolean')) {
                this.appointmentRepository.cancelAppointmentWithoutUser(Appointment);
            }
            else
                this.exceptionRepository.createException('La cita no existe', HttpStatus.BAD_REQUEST);
        }
    }

    ExecuteDeletor = async (appointmentId: number, userId: number) => {
        if (await this.verifyAppointment.VerifyRole(userId))
            await this.appointmentRepository.deleteAppointment(appointmentId);
        this.exceptionRepository.createException('No puedes eliminar una cita', HttpStatus.UNAUTHORIZED);
    }
}