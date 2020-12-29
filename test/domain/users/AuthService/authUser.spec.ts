import UserAuthModel from "src/domain/UserAuthentication/Model/UserAuthModel";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";
import UserAuthenticationService from "src/domain/UserAuthentication/Service/UserAuthenticationService";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - AuthUserService', () => {

    it("It should be fail if the user don't exists", async () => {
        const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(null, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => null)
        }, new UserException(), {
            validation: jest.fn((credentials: UserAuthModel, password: string) => false)
        });
        const user: LoginDTO = {
            email: 'asd@asd.com',
            password: '123456'
        }
        await expect(_userAuthenticationService.ExecuteLogin(new UserAuthModel(user, new UserException())))
            .rejects.toThrow('El usuario no existe');

    });

    it("It should be fail if the user exists but the password is incorrect", async () => {
        const _userAuthenticationService: UserAuthenticationService = new UserAuthenticationService(null, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User())
        }, new UserException(), {
            validation: jest.fn((credentials: UserAuthModel, password: string) => false)
        });
        const user: LoginDTO = {
            email: 'asd@asd.com',
            password: '123456'
        }
        _userAuthenticationService
        await expect(_userAuthenticationService.ExecuteLogin(new UserAuthModel(user, new UserException())))
            .rejects.toThrow('Contraseña Incorrecta');
    });
})