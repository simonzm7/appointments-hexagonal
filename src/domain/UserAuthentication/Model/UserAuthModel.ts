import { HttpStatus } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import LoginDTO from "../Repository/DTO/LoginDTO";

export default class UserAuthModel
{
    private credentials : LoginDTO;
    constructor(credentials : LoginDTO, private readonly userException : ExceptionRepository)   {
        this.credentials = credentials;
    }
    get getEmail(): string {
        return this.credentials.email;
    }
    get getPassword(): string {
        return this.credentials.password;
    }
}