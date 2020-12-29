import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";

export abstract class AppointmentValidationRepository {
    //ar the time of create appointment
    abstract VerifyIfDoctorHaveAppointment(idDoctor : number, dateTime : string) : Promise<boolean>;
    abstract VerifyRole(userId : number) : Promise<boolean>;

    //at the time of take appointment
    abstract VerifyDNI(dni : string, weekDay : number) : boolean;
    abstract VerifyAppointmentStatus(appointmentId : number, appointmentDate: Date) : Promise<Appointments | boolean>;
    abstract VerifyIfCustomerHaveBalance(userId : number, appointmentCost) : Promise<User | boolean>;
    abstract VerifyAppointmentByIdsAndReturn(appointmentId : number, userId : number) : Promise<Appointments | boolean>;
    abstract VerifyAppointmentByIdAndReturn(appointmentId : number) : Promise<Appointments | boolean>;
}