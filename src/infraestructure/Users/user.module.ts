import { Module } from '@nestjs/common';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import { UserService } from 'src/domain/Users/services/UserService';
import { UserController } from './controllers/user.controller';
import { MergeProvider, MergeValidations, MergeDB } from './MergedProviders/MergeProvider';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './EntityManager/user.entity';
import { ExceptionModel } from '../Exceptions/exceptions.model';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../Appointments/adapters/Guard/AuthGuard';



@Module({
    imports: [TypeOrmModule.forFeature([User]), ExceptionModel],
    providers: [UserRegisterManagment, UserService,MergeProvider, MergeValidations, MergeDB, {
        provide: APP_GUARD,
        useClass: AuthGuard
    }],
    controllers: [UserController],
    exports: [MergeValidations, MergeDB]
})
export class UserModule {}