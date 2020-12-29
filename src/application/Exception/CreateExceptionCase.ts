import { Injectable } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";


@Injectable()
export default class CreateExceptionCase{
    constructor(private readonly  exceptionRepository : ExceptionRepository) {}
    Execute = (message: any, code : number) => {
        this.exceptionRepository.createException(message, code);
    }
}