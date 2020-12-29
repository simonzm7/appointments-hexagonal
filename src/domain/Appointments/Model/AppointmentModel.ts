import { HttpStatus } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { AppointmentDTO } from "../Repository/DTO/AppointmentDTO";

export class AppointmentModel {

    private readonly appointment: AppointmentDTO;
    constructor(appointment: AppointmentDTO, private readonly userException: ExceptionRepository) {
        
        this.appointment = appointment;
        this.validFormat(this.appointment['appointmentDate']);
        this.appointment['appointmentDate'] = this.structureDate();
        var Initialize: string[] = [
            this.Check('idDoctor').IsNumber(),
            this.Check('appointmentDate').validDay(),
            this.Check('appointmentDate').validHours(this.appointment.IsFestive === true ? true : false),
            this.Check('cost').IsLength({min: 0, max: 1000000}),
        ];
        
        const errors: string[] = this.ValidInputs(Initialize);
        if (errors.length > 0)
            this.userException.createException(errors, HttpStatus.BAD_REQUEST);



    }
    structureDate() {
        const splited: string[] = this.appointment['appointmentDate'].split('/');
        const DateTime: string[] = splited[3].split(':');
        const date: Date = new Date(parseInt(splited[2]), parseInt(splited[1]), parseInt(splited[0])
            , parseInt(DateTime[0]), parseInt(DateTime[1]), parseInt(DateTime[2]));
        return date;

    }
    validFormat(format: string) {
        const dateRegex: RegExp = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-1]))(\/)\d{4}(\/)(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/
        if (!dateRegex.test(format))
            this.userException.createException('Formato de fecha invalido', 400);
    }
    ValidInputs(inputs: string[]): string[] {
        const errors: string[] = [];
        inputs.forEach(e => { if (e) errors.push(e) })
        return errors;
    }
    Check(valueName: string) {
        const time: Date = this.appointment[valueName];
        return {
            validDay: () => {
                if (time.getDay() === 0)
                    return 'No puedes crear una cita el dia Domingo';
            },
            validHours: (IsFestive: boolean) => { //Parameters based on a interface, I have that create interface
                const Hour: number = time.getHours();
                if (!IsFestive && Hour < 7 || Hour === 12 || Hour > 17)
                    return 'No puedes crear citas en este horario';

                if (IsFestive && Hour < 10 || Hour === 12 || Hour > 15)
                    return 'No puedes crear citas en este horario';
            },
            IsNumber: () => {
                const numberRegex : RegExp = /^[0-9]+$/;
                if (!numberRegex.test(this.appointment[valueName]))
                    return `El ${valueName} debe ser solo numérico`;
            },
            IsLength: (conditions: { min: number, max: number }) => {
                if (this.appointment[valueName] < conditions.min)
                    return `El precio minimo del ${valueName} es ${conditions.min}`;
                if (this.appointment[valueName] > conditions.max)
                    return `El precio maximo del ${valueName} es ${conditions.max}`;
            }
        }
    }
    get DateTime(): any {
        return this.appointment.appointmentDate;
    }
    get getDoctorId(): number {
        return this.appointment.idDoctor;
    }
    get doctorname(): string {
        return this.appointment.doctorname;
    }

    get appointmentDate(): string {
        return this.appointment.appointmentDate;
    }
    get cost(): number {
        return this.appointment.cost;
    }
    get status(): number {
        return this.appointment.cost;
    }
    get IsFestive(): boolean {
        return this.appointment.IsFestive;
    }
}