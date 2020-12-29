import { HttpStatus, Injectable } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { ValidationsRepository } from "src/domain/Users/repositories/Validations/ValidationsRepository";
import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import UserAuthModel from "../Model/UserAuthModel";
import { AuthValidationRepository } from "../Repository/AuthValidationRepository";
import { LoginRepository } from "../Repository/LoginRepository";

@Injectable()
export default class UserAuthenticationService {
    constructor(private readonly loginRepository: LoginRepository,
        private readonly validationRepository: ValidationsRepository,
        private readonly exceptionRepository: ExceptionRepository,
        private readonly authValidationRepository: AuthValidationRepository
    ) { }
    ExecuteLogin = async (credentials: UserAuthModel) => {
        const userEntity: User = await this.validationRepository.UserAlreadyExistsAndReturn(credentials.getEmail);
        if (userEntity) {
            if (this.authValidationRepository.validation(credentials, userEntity.password))
                  this.loginRepository.LoginUser(userEntity.userId);
            this.exceptionRepository.createException('Contraseña Incorrecta', HttpStatus.BAD_REQUEST);
        }
        this.exceptionRepository.createException('El usuario no existe', HttpStatus.BAD_REQUEST);
    }
}