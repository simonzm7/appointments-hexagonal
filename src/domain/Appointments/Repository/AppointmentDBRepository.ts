import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AppointmentModel } from "../Model/AppointmentModel";
import { ActionType } from "./Enums/ActionType";


export abstract class AppointmentDBRepository
{
    abstract createAppointment(appointment : AppointmentModel);
    abstract listAppointments(parameters : {}) : Promise<Appointments[]>;
    abstract findAppointmentByIdAndStatus(idAppointment : number) : Promise<Appointments>;
    abstract findAppointmentByIds(idAppointment : number, idUser : number) : Promise<Appointments>;
    abstract findAppointmentById(idAppointment : number) : Promise<Appointments>;
    abstract findAppointmentByIdAndDelete(idAppointment : number);
    abstract putAppointment(appointment : Appointments, Action : ActionType, user : User);
}