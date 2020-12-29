import { Injectable } from "@nestjs/common";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { ValidationsRepository } from "src/domain/Users/repositories/Validations/ValidationsRepository";
import { User } from "../EntityManager/user.entity";


@Injectable()
export default class ValidationsAdapter implements ValidationsRepository {
    constructor(private readonly dbAdapter: DBRepository) { }
    async UserAlreadyExists(email: string, dni: string): Promise<boolean> {
        const verify = await this.dbAdapter.findOneByEmailAndDni(email, dni);
        if (verify) return true;
        else
            return false;
    }

    UserAlreadyExistsAndReturn = async (email: string): Promise<User> => {

        const verify: User = await this.dbAdapter.findOneByEmail(email);
        if (verify)
            return verify;
        else return null;
    }

    VerifyBalancaCapacity = (balance: number, userBalance: number): number => {
        if ((balance + userBalance) > 9000000) {
            const allowedBalance = 9000000 - userBalance;
            return allowedBalance;
        }
    }
}