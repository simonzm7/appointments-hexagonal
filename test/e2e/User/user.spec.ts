import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { createSandbox, SinonStubbedInstance } from "sinon";
import { abstractUser } from 'src/domain/Users/repositories/Users/abstractUser';
import { ValidationsRepository } from 'src/domain/Users/repositories/Validations/ValidationsRepository';
import { createStubObj } from 'test/util/createObjectStub';
import { UserController } from 'src/infraestructure/Users/controllers/user.controller';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import { UserService } from 'src/domain/Users/services/UserService';
import { UserDTO } from 'src/domain/Users/repositories/Users/DTO/UserDTO';
import { ExceptionModel } from 'src/infraestructure/Exceptions/exceptions.model';
import { User } from 'src/infraestructure/Users/EntityManager/user.entity';


const sinonSandbox = createSandbox();
describe('UserController', () => {

    let app: INestApplication;
    let userRepository: SinonStubbedInstance<abstractUser>;
    let userValidations: SinonStubbedInstance<ValidationsRepository>;

    beforeAll(async () => {
        userRepository = createStubObj<abstractUser>(['createUser', 'findUserByIdAndReturn'], sinonSandbox);
        userValidations = createStubObj<ValidationsRepository>(['UserAlreadyExists', 'VerifyBalancaCapacity'], sinonSandbox);

        const moduleRef = await Test.createTestingModule({
            imports: [ExceptionModel],
            controllers: [UserController],
            providers: [UserRegisterManagment, UserService, {provide: ValidationsRepository, useValue: userValidations}
            , {provide: abstractUser, useValue: userRepository}]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    })
    afterEach(() => sinonSandbox.restore());
    afterAll(async () => await app.close());

    it('It should be faild if the user already exists', async () => {
        userValidations.UserAlreadyExists.returns(Promise.resolve(true));

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            role: 'Customer'
        }
        await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);
    });


    it('It should be fail if the email not is and email', async () => {
        userValidations.UserAlreadyExists.returns(Promise.resolve(true));

        const user : UserDTO = {
            email: 'asd@@gmail.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual({"error": "Bad Request", "message": ["email must be an email"], "statusCode": 400});
    });

    it('It should be fail if the password length is less than 4', async () => {

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '123',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual([ 'The minimum password length is 4' ]);
    });

    it('It should be fail if the password length is less than 4', async () => {

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '1234567890123456789012345678901',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);
        expect(response.body).toEqual([ 'The maximum password length is 30' ]);
    });

    it('It should be fail if the firstname and lastname not is a string only', async () => {

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '12345',
            firstname: 'juan@',
            lastname: 'zapata!',
            dni: '1234567890',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);

        const errorsList : string[] = ['The firstname must be just a string', 'The lastname must be just a string'];
        expect(response.body).toEqual(errorsList);
    });
    
    it('It should be fail if the dni not is a numeric only', async () => {

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '123456789@',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(['The DNI must be just numeric']);
    });

    it('It should be fail if the dni not is a numeric only', async () => {

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '123456789',
            role: 'Customer'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(['The minimum dni length is 10']);
    });

    it('It should be fail if the role not is a allowed role', async () => {

        const user : UserDTO = {
            email: 'asd@gmail.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            role: 'Administrator'
        }
        const response = await request(app.getHttpServer())
        .post('/api/user').send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual(['Invalid user role']);
    });

    //Update Balance
    it("It should be fail if the user don't exists", async () => {

        const user : any = {
            balance: 1000000
        }
        userRepository.findUserByIdAndReturn.returns(null);
        const response = await request(app.getHttpServer())
        .put('/api/user').set({userid: 1}).send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual({message: "El usuario no existe", statusCode: HttpStatus.BAD_REQUEST});
    });

    it("It should be fail if the user exceds the balance capacity", async () => {

        const user : User = {
            userId: 1,
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            dni: '',
            balance: 0,
            role: ''
        }
        userRepository.findUserByIdAndReturn.returns(Promise.resolve(user));
        userValidations.VerifyBalancaCapacity.returns(0);
        const response = await request(app.getHttpServer())
        .put('/api/user').set({userid: 1}).send(user)
        .expect(HttpStatus.BAD_REQUEST);

        expect(response.body).toEqual({message: "Solo puede ingresar el balance de : 0", statusCode: HttpStatus.BAD_REQUEST});
    });
})