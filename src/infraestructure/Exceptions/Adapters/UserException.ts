import { HttpException, Injectable } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";

@Injectable()
export class UserException implements ExceptionRepository{
     
    public createException(message : any, statusCode : number)
    {
        throw new HttpException(message, statusCode);
    }
}