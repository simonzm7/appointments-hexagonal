import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import {AuthValidationRepository} from "src/domain/UserAuthentication/Repository/AuthValidationRepository";
import { LoginRepository } from "src/domain/UserAuthentication/Repository/LoginRepository";
import { ValidationsRepository } from "src/domain/Users/repositories/Validations/ValidationsRepository";
import { UserException } from "src/infraestructure/Exceptions/Adapters/UserException";
import { LoginAdapter } from "../Adapters/LoginAdapter";
import { ValidationsAdapter } from "../Adapters/ValidationAdapter";

export const MergeRepository = {
    provide: LoginRepository,
    useClass: LoginAdapter
}

export const MergeExceptionRepository = {
    provide: ExceptionRepository,
    useClass: UserException
}
export const MergeValidations = {
    provide: AuthValidationRepository,
    useClass: ValidationsAdapter
}
