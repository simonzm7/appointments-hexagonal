import { HttpStatus, Injectable } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { LoginRepository } from "src/domain/UserAuthentication/Repository/LoginRepository";

@Injectable()
export class LoginAdapter implements LoginRepository{
    constructor(private readonly exceptionRepository : ExceptionRepository) {}
    LoginUser = (userId : number) => {
        this.exceptionRepository.createException({message: 'Sesion Iniciada', userId}, HttpStatus.OK);
    }
}