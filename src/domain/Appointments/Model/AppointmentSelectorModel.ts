import { AppointmentSelectorDTo } from "../Repository/DTO/AppointmentSelectorDTO";

export class AppointmentSelectorModel {

    private appointmentSelector : AppointmentSelectorDTo;
    private appointmentDay : Date;
    constructor(appointmentSelector : AppointmentSelectorDTo)
    {
        this.appointmentSelector = appointmentSelector;
        this.appointmentDay = this.structureDate();
        //verifyFormat
    }
    structureDate() {
        const splited: string[] = this.appointmentSelector['week'].split('/');
        const DateTime: string[] = splited[3].split(':');
        const date: Date = new Date(parseInt(splited[2]), parseInt(splited[1]), parseInt(splited[0])
            , parseInt(DateTime[0]), parseInt(DateTime[1]), parseInt(DateTime[2]));
        return date;

    }
    get getAppointmentDate() : Date {
        return this.appointmentDay;
    }
    get getWeekDay() : number {
        const week : number = this.appointmentDay.getDay();
        return week;
    }

    get getAppointmentId() : number {
        return this.appointmentSelector.AppointmentId;
    }
    get getUserId() : number {
        return this.appointmentSelector.userId;
    }
}