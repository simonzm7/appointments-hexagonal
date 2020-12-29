import { User } from "src/infraestructure/Users/EntityManager/user.entity";

export abstract class ValidationsRepository
{
    public abstract UserAlreadyExists(email : string, dni : string) : Promise<boolean>;
    public abstract UserAlreadyExistsAndReturn(email : string) : Promise<User>;
    public abstract VerifyBalancaCapacity(balance : number, userBalance : number) :number;

}