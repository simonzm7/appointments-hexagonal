import { IsString, IsNumber, IsBoolean } from 'class-validator';
export class AppointmentDTO {

    idDoctor : number;

    @IsString()
    doctorname : string;

    appointmentDate : any;

    @IsNumber()
    cost : number;

    @IsNumber()
    status : number;

    @IsBoolean()
    IsFestive : boolean;

    idUser : number;
}