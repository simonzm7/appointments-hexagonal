import { Controller, Post, Get, Put, Body, Req, Param, UsePipes, ValidationPipe, Delete, UseGuards } from "@nestjs/common";
import { createAppointmentCase } from "src/application/Appointments/UseCases/createAppointmentCase";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { AuthGuard } from "../adapters/Guard/AuthGuard";
import { Appointments } from "../DBEntities/appointment.entity";

@Controller('api/appointments')
@UseGuards(AuthGuard)
export class AppointmentController {
   constructor(private readonly createAppointment: createAppointmentCase) { }
   @Get()
   async getAvailableAppointments(): Promise<Appointments[]> {
      return await this.createAppointment.ExecuteList();
   }

   @UsePipes(new ValidationPipe({ transform: true }))
   @Post()
   async create(@Body() appointment: AppointmentDTO, @Req() req) {
      appointment.idDoctor = req.headers.userid;;
      await this.createAppointment.ExecuteCreate(appointment);
   }
   @UsePipes(new ValidationPipe({ transform: true }))
   @Put()
   async selectAppointment(@Body() dto: AppointmentSelectorDTo, @Req() req) {
      dto.userId = req.headers.userid;;
      await this.createAppointment.ExecuteSelector(dto);
   }
   @Put(':id')
   async cancelAppointment(@Param() param, @Req() req) {
      await this.createAppointment.ExecuteCanceller(parseInt(param.id), req.headers.userid);
   }
   @Delete(':id')
   async deleteAppointment(@Param() param, @Req() req) {
      await this.createAppointment.ExecuteDeletor(parseInt(param.id), req.headers.userid);
   }
}