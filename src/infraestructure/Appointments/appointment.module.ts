import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from "@nestjs/typeorm";
import { createAppointmentCase } from 'src/application/Appointments/UseCases/createAppointmentCase';
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentService';
import { ExceptionModel } from '../Exceptions/exceptions.model';
import { MergeExceptionRepository } from '../Exceptions/MergeProviders/MergeProviders';
import { User } from '../Users/EntityManager/user.entity';
import { MergeDB } from '../Users/MergedProviders/MergeProvider';
import { AuthGuard } from './adapters/Guard/AuthGuard';
import { AppointmentController } from './controllers/appointment.controller';
import { Appointments } from './DBEntities/appointment.entity';
import { MergeAdapter, MergeDBRepository, MergeValidations } from "./MergeProviders/mergeAppointment";
@Module({
    imports: [ExceptionModel,TypeOrmModule.forFeature([Appointments]),TypeOrmModule.forFeature([User])],
    controllers: [AppointmentController],
    providers: [createAppointmentCase,AppointmentService, {
        provide: APP_GUARD,
        useClass: AuthGuard
    }, MergeAdapter, MergeDBRepository, MergeValidations, MergeDB]
})
export class AppointmentModule {}