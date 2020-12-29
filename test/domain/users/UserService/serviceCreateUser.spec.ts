import { UserModel } from "src/domain/Users/models/UserModel";
import { UserDTO } from "src/domain/Users/repositories/Users/DTO/UserDTO";
import { UserService } from "src/domain/Users/services/UserService";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";


describe('Domain - UserService', () => {
    it('It should be fail if the user already exists', async () => {
        const _userService = new UserService(null, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance : number, userBalance : number) => 0)
        }, new UserException());
        const user: UserDTO = {
            email: "asd@asd.com",
            password: "12345",
            firstname: "juan",
            lastname: "zapata",
            dni: "1234567890",
            role: "Customer"
        }
        await expect(_userService.Execute(new UserModel(user, new UserException())))
            .rejects.toThrow("User Already Exists")
    });


    //ExecuteBalance

    it('It should be fail if the user in balance already exists', async () => {
        const _userService = new UserService({
            createUser: jest.fn((user : UserModel) => {}),
            updateBalance: jest.fn((balance : number, user : User) => {}),
            findUserByIdAndReturn: jest.fn(async (userId : number) => null)
        }, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance : number, userBalance : number) => 0)
        }, new UserException());
        await expect(_userService.ExecuteBalance(1,1))
            .rejects.toThrow("El usuario no existe");
    });


    it('It should be fail if the user  balance exceds limit', async () => {
        const _userService = new UserService({
            createUser: jest.fn((user : UserModel) => {}),
            updateBalance: jest.fn((balance : number, user : User) => {}),
            findUserByIdAndReturn: jest.fn(async (userId : number) => new User())
        }, {
            UserAlreadyExists: jest.fn(async (email, dni) => email == 'asd@asd.com' && dni == '1234567890'),
            UserAlreadyExistsAndReturn: jest.fn(async (email) => new User()),
            VerifyBalancaCapacity: jest.fn((balance : number, userBalance : number) => 0)
        }, new UserException());
        await expect(_userService.ExecuteBalance(1,1))
            .rejects.toThrow("Solo puede ingresar el balance de : 0");
    });
});