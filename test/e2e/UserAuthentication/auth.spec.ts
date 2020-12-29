import * as request from 'supertest';
import { Test } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { createSandbox, SinonStubbedInstance } from "sinon";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/UserLoginManagement";
import UserAuthenticationService from "src/domain/UserAuthentication/Service/UserAuthenticationService";
import { ValidationsRepository } from "src/domain/Users/repositories/Validations/ValidationsRepository";
import { LoginRepository } from "src/domain/UserAuthentication/Repository/LoginRepository";
import { createStubObj } from "test/util/createObjectStub";
import UserAuthenticationController from "src/infraestructure/UserAuthentication/Controllers/auth.controller";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";
import { ExceptionModel } from "src/infraestructure/Exceptions/exceptions.model";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { AuthValidationRepository } from 'src/domain/UserAuthentication/Repository/AuthValidationRepository';


const authSandbox = createSandbox();
describe('UserAuthenticationController', () => {
    let app : INestApplication;
    let loginRepository : SinonStubbedInstance<LoginRepository>;
    let validationsRepository : SinonStubbedInstance<ValidationsRepository>;
    let authValidationRepository : SinonStubbedInstance<AuthValidationRepository>;
    beforeAll(async () => {
        loginRepository = createStubObj<LoginRepository>(['LoginUser'],authSandbox);
        validationsRepository = createStubObj<ValidationsRepository>(['UserAlreadyExistsAndReturn'], authSandbox);
        authValidationRepository = createStubObj<AuthValidationRepository>(['validation'],authSandbox);
        const moduleRef = await Test.createTestingModule({
            imports: [ExceptionModel],
            controllers: [UserAuthenticationController],
            providers: [UserLoginManagement, UserAuthenticationService , {provide: LoginRepository, useValue: loginRepository}
            , {provide: ValidationsRepository, useValue: validationsRepository}, {provide: AuthValidationRepository, useValue: authValidationRepository}]
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init(); 
    })
    afterEach(() => authSandbox.restore());
    afterAll(async () => await app.close());

    it('It should be fail if the user don´t exists', async () => {

        const user : LoginDTO = {
            email: 'nonexistuser@gmail.com',
            password: '12345'
        }
     
        validationsRepository.UserAlreadyExistsAndReturn.returns(Promise.resolve(undefined));
        const response = await request(app.getHttpServer())
        .post('/api/auth').send(user)
        .expect(HttpStatus.BAD_REQUEST);
         expect(response.body.message).toEqual('El usuario no existe');
    });

    it('It should be fail if the user exists, but the password is incorrect', async () => {

        const user : LoginDTO = {
            email: 'asd@gmail.com',
            password: '12345'
        }
        const userModel : User = {
            userId : 1,
            email: 'asd@gmail.com',
            password: '12345',
            firstname: 'juan',
            lastname: 'zapata',
            dni: '1234567890',
            balance: 1000000,
            role: 'Customer'
        }
        validationsRepository.UserAlreadyExistsAndReturn.returns(Promise.resolve(userModel));
        authValidationRepository.validation.returns(false);
        const response = await request(app.getHttpServer())
        .post('/api/auth').send(user)
        .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toEqual('Contraseña Incorrecta');
    });
    //¡¡¡ CREATE MORE UNIT TESTING ABOUT AUTH INPUT VALIDATIONS!!!

})