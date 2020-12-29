import {Injectable } from "@nestjs/common";
import UserAuthModel from "src/domain/UserAuthentication/Model/UserAuthModel";
import { AuthValidationRepository } from "src/domain/UserAuthentication/Repository/AuthValidationRepository";

@Injectable()
export class ValidationsAdapter implements AuthValidationRepository {
    validation = (credentials: UserAuthModel, password: string): boolean => {
        if (credentials.getPassword === password)
            return true;

        return false;
    }
}