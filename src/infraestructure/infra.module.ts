import { Module } from '@nestjs/common';
import { UserModule } from './Users/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import UserAuthenticationModule from './UserAuthentication/auth.module';
import { AppointmentModule } from './Appointments/appointment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
    imports:[AppointmentModule,UserModule,UserAuthenticationModule, 
      TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService : ConfigService) => ({
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: 3306,
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: ["dist/**/*.entity{.ts,.js}"],
      }),
      inject: [ConfigService]
    }), ConfigModule.forRoot({
        isGlobal: true
      })]
})
export class InfraestructureModel{}