import { User } from "src/infraestructure/Users/EntityManager/user.entity";
import { UserModel } from "../../models/UserModel";

export abstract class DBRepository {
    public abstract findOneByEmailAndDni(email : string, dni : string) : Promise<User>;
    public abstract findOneByEmail(email : string) : Promise<User>;
    public abstract findOneById(id : number) : Promise<User>;
    public abstract CreateOne(user : UserModel);
    public abstract UpdateBalance(user : User);
}