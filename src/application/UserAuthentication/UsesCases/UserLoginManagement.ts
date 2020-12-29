import { Injectable } from "@nestjs/common";
import UserAuthModel from "src/domain/UserAuthentication/Model/UserAuthModel";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";
import UserAuthenticationService from "src/domain/UserAuthentication/Service/UserAuthenticationService";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";
@Injectable()
export default class UserLoginManagement {
    constructor(private readonly userService : UserAuthenticationService){}
    ExecuteLogin = async (credentials : LoginDTO) => {
       await this.userService.ExecuteLogin(new UserAuthModel(credentials, new UserException()));
    }
}