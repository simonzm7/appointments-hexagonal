import { HttpException, Injectable } from "@nestjs/common";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { AppointmentValidationRepository } from "src/domain/Appointments/Repository/AppointmentValidationRepository";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { WeekDays } from "src/domain/Appointments/Repository/Enums/WeekDays";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { Double } from "typeorm";
import { Appointments } from "../DBEntities/appointment.entity";
@Injectable()
export class AppointmentValidationAdapter implements AppointmentValidationRepository {
    constructor(private readonly dbRepository: DBRepository,
        private readonly appointmentDBRepository: AppointmentDBRepository) { }
    VerifyIfDoctorHaveAppointment = async (idDoctor: number, dateTime: any): Promise<boolean> => {
        const newAppointmentDate: Date = new Date(dateTime);
        const appointment: Appointments[] = await this.appointmentDBRepository.listAppointments({ idDoctor, appointmentStatus: '0' });
        const errors: any[] = [];
        appointment.forEach((a: Appointments) => {
            const convertToDate: Date = new Date(a.appointmentdate);
            const difference: Double = Math.abs(newAppointmentDate.getTime() - convertToDate.getTime()) / 3600000;
            errors.push(difference);
        });
        if (errors[errors.length - 1] < 1)
            return Promise.resolve(true);
        return Promise.resolve(false);
    }
    VerifyRole = async (userId: number): Promise<boolean> => {
        const user: User = await this.dbRepository.findOneById(userId);
        if (user.role.toLocaleLowerCase() === 'doctor')
            return Promise.resolve(true);
        else
            return Promise.resolve(false);
    }


    // Taking appointment
    VerifyDNI = (dni: string, weekDay: number): boolean => {
        if (parseInt(dni.substring(9, 10)) % 2 === 0) {
            if (weekDay === WeekDays.Monday || weekDay === WeekDays.Wednesday || weekDay === WeekDays.Friday) {
                return true;
            }
            else
                return false;
        }
        if (parseInt(dni.substring(9, 10)) % 2 === 1) {
            if (weekDay === WeekDays.Tuesday || weekDay === WeekDays.Thursday || weekDay === WeekDays.Sunday) {
                return true;
            }
            return false;
        }
    }
    VerifyAppointmentStatus = async (idAppointment: number, requestDate: Date): Promise<Appointments | boolean> => {
        const Appointment: Appointments = await this.appointmentDBRepository.findAppointmentByIdAndStatus(idAppointment);

        if (Appointment) {
            const appointmentCreationDate: Date = new Date(Appointment.appointmentdate);
            if (requestDate.getDate() > appointmentCreationDate.getDate()) {
                return Promise.resolve(false);
            }
            return Promise.resolve(Appointment);
        }
        else
            return Promise.resolve(false);
    }
    VerifyIfCustomerHaveBalance = async (userId: number, appointmentCost): Promise<User | boolean> => {
        const user: User = await this.dbRepository.findOneById(userId);
        if (user && user.balance >= appointmentCost) return Promise.resolve(user);
        else
            return Promise.resolve(false);
    }
    VerifyAppointmentByIdsAndReturn = async (idAppointment : number, userId  : number) : Promise<Appointments | boolean> => {
        const Appointment: Appointments = await this.appointmentDBRepository.findAppointmentByIds(idAppointment, userId);
        if(Appointment) return Promise.resolve(Appointment);
        else
        return Promise.resolve(false);
    }
    VerifyAppointmentByIdAndReturn = async (idAppointment : number) : Promise<Appointments | boolean> => {
        const Appointment: Appointments = await this.appointmentDBRepository.findAppointmentById(idAppointment);
        if(Appointment) return Promise.resolve(Appointment);
        else
        return Promise.resolve(false);
    }
}