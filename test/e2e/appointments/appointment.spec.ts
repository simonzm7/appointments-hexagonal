import * as request from 'supertest';
import { createSandbox, SinonStubbedInstance } from "sinon";
import { Test } from "@nestjs/testing";
import { createStubObj } from 'test/util/createObjectStub';
import { Appointments } from 'src/infraestructure/Appointments/DBEntities/appointment.entity';
import { HttpStatus, INestApplication } from "@nestjs/common";
import { AppointmentRepository } from "src/domain/Appointments/Repository/AppointmentRepository";
import { AppointmentController } from "src/infraestructure/Appointments/controllers/appointment.controller";
import { createAppointmentCase } from "src/application/Appointments/UseCases/createAppointmentCase";
import { AppointmentService } from 'src/domain/Appointments/Services/AppointmentService';
import { AppointmentValidationRepository } from 'src/domain/Appointments/Repository/AppointmentValidationRepository';
import { ExceptionModel } from 'src/infraestructure/Exceptions/exceptions.model';
import { AppointmentDTO } from 'src/domain/Appointments/Repository/DTO/AppointmentDTO';
import { DBRepository } from 'src/domain/Users/repositories/DB/DBRepository';

const sinonSandbox = createSandbox();
describe('AppointmentController', () => {
    let app: INestApplication;
    let appointmentRepository: SinonStubbedInstance<AppointmentRepository>;
    let appointmentValidationRepository: SinonStubbedInstance<AppointmentValidationRepository>;
    let dbRepository: SinonStubbedInstance<DBRepository>;
    beforeAll(async () => {
        appointmentRepository = createStubObj<AppointmentRepository>(['createAppointment', 'listAppointments'], sinonSandbox);
        appointmentValidationRepository = createStubObj<AppointmentValidationRepository>(['VerifyIfDoctorHaveAppointment', 'VerifyRole',
            'VerifyAppointmentStatus', 'VerifyAppointmentByIdsAndReturn', 'VerifyDNI'
            , 'VerifyIfCustomerHaveBalance', 'VerifyAppointmentByIdAndReturn'], sinonSandbox);
        dbRepository = createStubObj<DBRepository>(['UpdateBalance', 'findOneById'], sinonSandbox);
        const moduleRef = await Test.createTestingModule({
            imports: [ExceptionModel],
            controllers: [AppointmentController],
            providers: [createAppointmentCase,
                AppointmentService,
                { provide: AppointmentRepository, useValue: appointmentRepository },
                { provide: AppointmentValidationRepository, useValue: appointmentValidationRepository },
                { provide: DBRepository, useValue: dbRepository }]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
    afterEach(() => sinonSandbox.restore());
    afterAll(async () => await app.close());
    const commonHeader = {
        userid: 2
    }
    it('It should get appointments list', async () => {
        const appoitmentsList: Appointments[] = [{ idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }];
        appointmentRepository.listAppointments.returns(Promise.resolve(appoitmentsList));

        return await request(app.getHttpServer())
            .get('/api/appointments')
            .set(commonHeader)
            .expect(HttpStatus.OK)
            .expect(appoitmentsList);
    });
    it('It should be fail if the doctor have an appointment on the same hour', async () => {

        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(true));
        const appointment: AppointmentDTO = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response: request.Response= await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toEqual('Solo puedes crear una cita cada hora');
    });
    it('It should be fail if the role is a Customer', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: AppointmentDTO = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments')
            .set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.UNAUTHORIZED);

        expect(response.body.message).toEqual('No puedes crear una cita');
    });
    it('It should be fail if the appointment Date not is specific format', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: AppointmentDTO = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '000/29/11/2020/8:00:00',
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader)
            .send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toEqual("Formato de fecha invalido");
    });

    it('It should be fail if the cost not is numeric only', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: '@80500',
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response: request.Response = await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({ "error": "Bad Request", "message": ["cost must be a number conforming to the specified constraints"], "statusCode": HttpStatus.BAD_REQUEST });
    });

    it('It should be fail if the cost is higher to 1000000', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: 2000000,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(["El precio maximo del cost es 1000000"]);
    });

    it('It should be fail if the cost is less to 0', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: -10,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(["El precio minimo del cost es 0"]);
    });

    it('It should be fail if the status not is numeric only', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: 80500,
            status: '0@',
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({ "error": "Bad Request", "message": ["status must be a number conforming to the specified constraints"], "statusCode": HttpStatus.BAD_REQUEST });
    });
    it('It should be fail if IsFestive not is boolean only', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '29/11/2020/8:00:00',
            cost: 80500,
            status: 0,
            IsFestive: '@false',
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({ "error": "Bad Request", "message": ["IsFestive must be a boolean value"], "statusCode": HttpStatus.BAD_REQUEST });
    });

    it('It should be fail if is Sunday', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '27/11/2020/11:00:00', // Real calendar
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(["No puedes crear una cita el dia Domingo"]);
    });

    it('It should be fail if is not is working hours', async () => {
        appointmentValidationRepository.VerifyIfDoctorHaveAppointment.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const appointment: any = {
            idDoctor: 1,
            doctorname: 'Juan Zapata',
            appointmentDate: '28/11/2020/6:00:00',
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const response : request.Response= await request(app.getHttpServer())
            .post('/api/appointments').set(commonHeader).send(appointment)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual(["No puedes crear citas en este horario"]);
    });

    it('It should be fail if the appointment not is available', async () => {
        appointmentValidationRepository.VerifyAppointmentStatus.returns(Promise.resolve(false));
        const selectAppointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00:00',
        }
        const response : request.Response= await request(app.getHttpServer())
            .put('/api/appointments').set(commonHeader).send(selectAppointment)
            .expect(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({ statusCode: HttpStatus.BAD_REQUEST, message: 'La cita no se encuentra disponible' });
            
    });

    it("It should be fail if the Customer don't have balance", async () => {

        const appointment : any = {
            idAppointment : 1,
            idDoctor: 1,
            doctorname: "Juan Zapata",
            appointmentDate: "25/11/2020/10:59:59",
            costappointment: 80500,
            appointmentStatus: 0,
            IsFestive: 'false',
            idUser: 1
        }
        appointmentValidationRepository.VerifyAppointmentStatus.returns(Promise.resolve(appointment));
        appointmentValidationRepository.VerifyIfCustomerHaveBalance.returns(Promise.resolve(false));
        const selectAppointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00:00',
        }
        const response : request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set(commonHeader).send(selectAppointment)
            .expect(HttpStatus.BAD_REQUEST);
             expect(response.body).toEqual({ statusCode: 400, message: 'No tienes saldo disponible' });
    });

    it("It should be fail if the Customer don't have pico y cedula", async () => {

        const appointment : any = {
            idAppointment : 1,
            idDoctor: 1,
            doctorname: "Juan Zapata",
            appointmentDate: "25/11/2020/10:59:59",
            costappointment: 80500,
            appointmentStatus: 0,
            IsFestive: 'false',
            idUser: 1
        }
        const user : any = {
            userId: 1,
            email : 'asd@asd.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            balande: 1000000,
            role: 'Customer'
        }
        appointmentValidationRepository.VerifyAppointmentStatus.returns(Promise.resolve(appointment));
        appointmentValidationRepository.VerifyIfCustomerHaveBalance.returns(Promise.resolve(user));
        const selectAppointment: any = {
            AppointmentId: 1,
            week: '28/11/2020/7:00:00',
        }
        const response : request.Response = await request(app.getHttpServer())
            .put('/api/appointments').set(commonHeader).set(commonHeader).send(selectAppointment)
            .expect(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({ statusCode: 400, message: 'No te encuentras en día pico y cédula' });
    });

//  Cancel Appointment
    it("It should be fail if the appointment do not exists", async () => {

        appointmentValidationRepository.VerifyAppointmentByIdsAndReturn.returns(Promise.resolve(false));
        appointmentValidationRepository.VerifyAppointmentByIdAndReturn.returns(Promise.resolve(false));
        const response : request.Response = await request(app.getHttpServer())
            .put('/api/appointments/1')
            .set(commonHeader)
            .expect(HttpStatus.BAD_REQUEST);
             expect(response.body).toEqual({ statusCode: HttpStatus.BAD_REQUEST, message: 'La cita no existe' });
    });

    it("It should be fail if the user do not exists", async () => {

        const appointment : any = {
            idAppointment : 1,
            idDoctor: 1,
            doctorname: "Juan Zapata",
            appointmentDate: "25/11/2020/10:59:59",
            costappointment: 80500,
            appointmentStatus: 0,
            IsFestive: 'false',
            idUser: 1
        }
        appointmentValidationRepository.VerifyAppointmentByIdsAndReturn.returns(Promise.resolve(appointment));
        dbRepository.findOneById.returns(Promise.resolve(null));
        const response : request.Response = await request(app.getHttpServer())
            .put('/api/appointments/1')
            .set(commonHeader)
            .expect(HttpStatus.BAD_REQUEST);
            expect(response.body).toEqual({ statusCode: HttpStatus.BAD_REQUEST, message: 'Usuario no existente' });
    });

    it("It should be fail if the user do not is a Doctor", async () => {

        appointmentValidationRepository.VerifyRole.returns(Promise.resolve(false));
        const response : request.Response = await request(app.getHttpServer())
            .delete('/api/appointments/1')
            .set(commonHeader)
            .expect(HttpStatus.UNAUTHORIZED);
            expect(response.body).toEqual({ statusCode: HttpStatus.UNAUTHORIZED, message: 'No puedes eliminar una cita' });
    });
});



