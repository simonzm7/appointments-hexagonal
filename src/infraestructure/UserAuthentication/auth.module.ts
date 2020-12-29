import { Module } from "@nestjs/common";
import CreateExceptionCase from "src/application/Exception/CreateExceptionCase";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/UserLoginManagement";
import UserAuthenticationService from "src/domain/UserAuthentication/Service/UserAuthenticationService";
import { ExceptionModel } from "../Exceptions/exceptions.model";
import { UserModule } from "../Users/user.module";
import UserAuthenticationController from "./Controllers/auth.controller";
import { MergeRepository, MergeExceptionRepository, MergeValidations } from "./MergeProviders/MergeProviders";


@Module({
    imports: [UserModule, ExceptionModel],
    controllers: [UserAuthenticationController],
    providers: [UserLoginManagement, UserAuthenticationService, MergeRepository, MergeExceptionRepository, MergeValidations]
})
export default class UserAuthenticationModule {}