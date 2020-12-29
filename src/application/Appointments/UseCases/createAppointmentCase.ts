import { Injectable } from "@nestjs/common";
import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { AppointmentService } from "src/domain/Appointments/Services/AppointmentService";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";



@Injectable()
export class createAppointmentCase
{
    constructor(private readonly appointmentService : AppointmentService) {}

    ExecuteCreate = async (appointment : AppointmentDTO) => {
        
        await this.appointmentService.ExecuteCreate(new AppointmentModel(appointment, new UserException()));
    }

    ExecuteList = async () : Promise<Appointments[]> => {
        return await this.appointmentService.ExecuteList();
    }

    ExecuteSelector = async (dto : AppointmentSelectorDTo) => {
        await this.appointmentService.ExecuteSelector(new AppointmentSelectorModel(dto));
    }
    ExecuteCanceller = async (id : number, userId : number) => {
        await this.appointmentService.ExecuteCanceller(id, userId);
    }
    
    ExecuteDeletor = async (appointmentId : number,userId : number) => {
        await this.appointmentService.ExecuteDeletor(appointmentId, userId);
    }
}