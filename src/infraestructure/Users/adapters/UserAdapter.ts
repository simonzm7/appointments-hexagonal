import { Injectable, HttpStatus } from "@nestjs/common";
import { UserModel } from "src/domain/Users/models/UserModel";
import { abstractUser } from "src/domain/Users/repositories/Users/abstractUser";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { User } from "../EntityManager/user.entity";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";

@Injectable()
export class UserAdapter implements abstractUser {
    constructor(private readonly dbProvider : DBRepository,
        private readonly exceptionRepository : ExceptionRepository){}
    async createUser(user : UserModel){
        await this.dbProvider.CreateOne(user);
    }

    async updateBalance(balance : number, user : User)
    {
        user.balance = Number(user.balance) + Number(balance);
        await this.dbProvider.UpdateBalance(user);
        this.exceptionRepository.createException('Balance Actualizado', HttpStatus.OK);
    }

    async findUserByIdAndReturn(userId : number) : Promise<User>
    {
        return await this.dbProvider.findOneById(userId);
    }
}