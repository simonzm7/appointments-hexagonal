import UserAuthModel from "../Model/UserAuthModel";

export abstract class AuthValidationRepository {
    public abstract validation(credentials : UserAuthModel, password : string) : boolean;
}