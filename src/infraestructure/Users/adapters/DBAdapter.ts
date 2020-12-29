import { HttpStatus, Injectable } from "@nestjs/common";
import {InjectRepository } from "@nestjs/typeorm";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { UserModel } from "src/domain/Users/models/UserModel";
import { DBRepository } from "src/domain/Users/repositories/DB/DBRepository";
import { Repository } from "typeorm";
import { User } from "../EntityManager/user.entity";

@Injectable()
export class DBAdapter implements DBRepository {
    constructor(@InjectRepository(User) private readonly userRepository : Repository<User>,
    private readonly exceptionRepository : ExceptionRepository) {}

    async findOneByEmailAndDni(email : string, dni : string) : Promise<User>
    {
        return await this.userRepository.findOne({
            where: [
                {email},
                {dni}
            ]
        });
    }

    async findOneByEmail(email : string) : Promise<User>
    {
        return await this.userRepository.findOne({email});
    }
    async findOneById(id : number) : Promise<User>
    {
        return await this.userRepository.findOne({userId: id});
    }
    async CreateOne(user : UserModel)
    {
        const response = await this.userRepository.save({
            email : user.get_email,
            password: user.get_password,
            firstname: user.get_first_name,
            lastname: user.get_last_name,
            dni: user.get_dni,
            balance: 1000000,
            role: user.get_role
        }).then(() => { return {code: HttpStatus.OK, message: 'User created sucessfully'}  })
        .catch((err) => { return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: err.code}  });
        this.exceptionRepository.createException(response.message, response	.code);
    }

    async UpdateBalance(user : User) {
        await this.userRepository.save(user);
    }
    
}