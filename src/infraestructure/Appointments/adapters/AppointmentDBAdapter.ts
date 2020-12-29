import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointments } from "../DBEntities/appointment.entity";
import { Repository } from "typeorm";
import { ActionType } from "src/domain/Appointments/Repository/Enums/ActionType";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { getConnection } from "typeorm";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";

@Injectable()
export class AppointmentDBAdapter implements AppointmentDBRepository {
    constructor(@InjectRepository(Appointments) private readonly appointmentEntity: Repository<Appointments>,
        private readonly userRepository: DBRepository,
        private readonly exceptionRepository: ExceptionRepository) { }
        
    createAppointment = async (appointment: AppointmentModel) => {
        const response = await this.appointmentEntity.save({
            idDoctor: appointment.getDoctorId,
            doctorname: appointment.doctorname,
            appointmentdate: appointment.appointmentDate,
            costappointment: appointment.cost,
            appointmentStatus: 0,
            IsFestive: `${appointment.IsFestive}`,
            idUser: null
        })
            .then(() => { return { code: HttpStatus.OK, message: 'Cita creada correctamente' }; })
            .catch((err) => { return { code: HttpStatus.BAD_REQUEST, message: err }; })
        this.exceptionRepository.createException(response.message, response.code);
    }
    listAppointments = async (): Promise<Appointments[]> => {
        const result = await this.appointmentEntity.find({ idUser: null });
        return result;
    }

    findAppointmentByIdAndStatus = async (idAppointment: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment, appointmentStatus: 0 });
    }

    findAppointmentByIds = async (idAppointment: number, idUser: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment, appointmentStatus: 1, idUser });
    }
    findAppointmentById = async (idAppointment: number): Promise<Appointments> => {
        return await this.appointmentEntity.findOne({ idAppointment });
    }
    findAppointmentByIdAndDelete = async (idAppointment: number) => {
        const verify = await this.appointmentEntity.findOne({ idAppointment });
        if (verify) {
            const response = await getConnection().createQueryBuilder()
                .delete()
                .from(Appointments)
                .where('idAppointment = :idAppointment', { idAppointment })
                .execute()
                .then(() => { return { code: HttpStatus.OK, message: 'Cita eliminada correctamente' } })
                .catch(() => { return { code: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error al eliminar la cita' } });
            this.exceptionRepository.createException(response.message, response.code);
        }
        this.exceptionRepository.createException('Cita no existente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    putAppointment = async (appointment: Appointments, actionType: ActionType, user: User) => {
        await this.appointmentEntity.save(appointment)
            .then(async () => {
                if (user && actionType === ActionType.Take) user.balance = user.balance - appointment.costappointment;
                if (user && actionType === ActionType.Cancel) user.balance = Number(user.balance) + Number(appointment.costappointment); 
                if (user) await this.userRepository.UpdateBalance(user);

            }).catch((err) => {
                this.exceptionRepository.createException(`Error al modificar la cita`, HttpStatus.BAD_REQUEST);
            })
    }
}