import { AppointmentDBRepository } from "src/domain/Appointments/Repository/AppointmentDBRepository";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { AppointmentValidationRepository } from "src/domain/Appointments/Repository/AppointmentValidationRepository";
import { AppointmentDBAdapter } from "../adapters/AppointmentDBAdapter";
import { AppointmentAdapter } from "../adapters/AppointmentsAdapter";
import { AppointmentValidationAdapter } from "../adapters/AppointmentValidationAdapter";


export const MergeAdapter = {
    provide: AppointmentRepository,
    useClass: AppointmentAdapter
}

export const MergeDBRepository = {
    provide: AppointmentDBRepository,
    useClass: AppointmentDBAdapter
}

export const MergeValidations = {
    provide: AppointmentValidationRepository,
    useClass: AppointmentValidationAdapter
}