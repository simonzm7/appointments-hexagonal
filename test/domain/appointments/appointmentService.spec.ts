import { AppointmentModel } from "src/domain/Appointments/Model/AppointmentModel";
import { AppointmentSelectorModel } from "src/domain/Appointments/Model/AppointmentSelectorModel";
import { AppointmentValidationRepository } from "src/domain/Appointments/Repository/AppointmentValidationRepository";
import { AppointmentDTO } from "src/domain/Appointments/Repository/DTO/AppointmentDTO";
import { AppointmentSelectorDTo } from "src/domain/Appointments/Repository/DTO/AppointmentSelectorDTO";
import { AppointmentService } from "src/domain/Appointments/Services/AppointmentService"
import { UserModel } from "src/domain/Users/models/UserModel";
import { Appointments } from "src/infraestructure/Appointments/DBEntities/appointment.entity";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - Appointment Service', () => {

    it('It should fail if the Doctor want create an appointment on the same hour', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => true),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, new UserException(), null);
        const appointmentDto: AppointmentDTO = {
            idDoctor: 1,
            doctorname: "Juan Zapata",
            appointmentDate: "25/11/2020/10:59:59",
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const appointment: AppointmentModel = new AppointmentModel(appointmentDto, new UserException());
        expect(_appointmentService.ExecuteCreate(appointment)).rejects.toThrow('Solo puedes crear una cita cada hora');
    });

    it('It should fail if the user not is a Doctor', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, new UserException(), null);
        const appointmentDto: AppointmentDTO = {
            idDoctor: 1,
            doctorname: "Juan Zapata",
            appointmentDate: "25/11/2020/10:59:59",
            cost: 80500,
            status: 0,
            IsFestive: false,
            idUser: null
        }
        const appointment: AppointmentModel = new AppointmentModel(appointmentDto, new UserException());
        expect(_appointmentService.ExecuteCreate(appointment)).rejects.toThrow('No puedes crear una cita');
    });

    it('It should get the appointments list', async () => {
        const appoitmentsList: Appointments[] = [{ idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }];
        const _appointmentService = new AppointmentService(
            {
                createAppointment: jest.fn((appointment: AppointmentModel) => { }),
                listAppointments: jest.fn((async (parameters: {}) => appoitmentsList)),
                takeAppointment: jest.fn((appointment: Appointments, user: User) => { }),
                cancelAppointment: jest.fn((appointment: Appointments, user: User) => { }),
                cancelAppointmentWithoutUser: jest.fn((appointment: Appointments) => { }),
                deleteAppointment: jest.fn((appointmentId: number) => { })
            }, null, new UserException(), null);
        expect(await _appointmentService.ExecuteList()).toEqual(appoitmentsList);
    });


    it('It should fail if appointment not is available', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => null),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, new UserException(), null);
        const appointmentDto: AppointmentSelectorDTo = {
            AppointmentId: 1,
            week: '25/11/2020/10:59:59',
            userId: 1
        }
        const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
        expect(_appointmentService.ExecuteSelector(selectorModel)).rejects.toThrow('La cita no se encuentra disponible');
    });

    it('It should fail if User do not have balance', async () => {
        const appointment: Appointments = { idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => appointment),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => null),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, new UserException(), null);
        const appointmentDto: AppointmentSelectorDTo = {
            AppointmentId: 1,
            week: '25/11/2020/10:59:59',
            userId: 1
        }
        const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
        expect(_appointmentService.ExecuteSelector(selectorModel)).rejects.toThrow('No tienes saldo disponible');
    });

    it('It should fail if User do not have pico and cedula', async () => {
        const appointment: Appointments = { idAppointment: 1, idDoctor: 1, doctorname: "Juan Zapata", appointmentdate: "2020-12-28 07:00:00.000", costappointment: 80500, appointmentStatus: 0, IsFestive: 'false', idUser: null }
        const user: User = {
            userId: 1,
            email: "asd1@asd1.com",
            password: "12345",
            firstname: "juan",
            lastname: "zapata",
            dni: "1234567890",
            balance: 1000000,
            role: "Customer"

        }
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => appointment),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => user),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => new Appointments()),
            }, new UserException(), null);
        const appointmentDto: AppointmentSelectorDTo = {
            AppointmentId: 1,
            week: '25/11/2020/10:59:59',
            userId: 1
        }
        const selectorModel: AppointmentSelectorModel = new AppointmentSelectorModel(appointmentDto);
        expect(_appointmentService.ExecuteSelector(selectorModel)).rejects.toThrow('No te encuentras en día pico y cédula');
    });

    // ExecuteCanceller

    it('It should fail if the appointment do not exists', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => true),
            }, new UserException(), {
                findOneByEmailAndDni: jest.fn(async (email : string, dni : string) => new User()),
                findOneByEmail: jest.fn(async (email : string) => new User()),
                findOneById: jest.fn(async (id : number) => null),
                CreateOne: jest.fn((user : UserModel) =>{}),
                UpdateBalance: jest.fn((user : User) => {}),
            });

        expect(_appointmentService.ExecuteCanceller(1,1)).rejects.toThrow('Usuario no existente');
    });
// ExecuteDeletor
    it('It should fail if the User do not is a Doctor', async () => {
        const _appointmentService: AppointmentService = new AppointmentService(null,
            {
                VerifyIfDoctorHaveAppointment: jest.fn(async (idDoctor: number, dateTime: string) => false),
                VerifyRole: jest.fn(async (userId: number) => false),
                VerifyDNI: jest.fn((dni: string, weekDay: number) => false),
                VerifyAppointmentStatus: jest.fn(async (appointmentId: number, appointmentDate: Date) => new Appointments()),
                VerifyIfCustomerHaveBalance: jest.fn(async (userId: number, appointmentCost) => new User()),
                VerifyAppointmentByIdsAndReturn: jest.fn(async (appointmentId: number, userId: number) => new Appointments()),
                VerifyAppointmentByIdAndReturn: jest.fn(async (appointmentId: number) => true),
            }, new UserException(),null);

        expect(_appointmentService.ExecuteDeletor(1, 1)).rejects.toThrow('No puedes eliminar una cita');
    });

})