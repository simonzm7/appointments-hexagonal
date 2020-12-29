import { IsString, IsNumber } from "class-validator";
export class AppointmentSelectorDTo {
    @IsNumber()
    AppointmentId : number;
    @IsString()
    week : string;
    userId : number;
}