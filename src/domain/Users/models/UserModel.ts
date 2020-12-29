import { HttpStatus } from "@nestjs/common";
import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { UserDTO } from "../repositories/Users/DTO/UserDTO";
import { IMethods } from "../repositories/Validations/IMethods";


export class UserModel {

    private readonly user: UserDTO;
    constructor(user: UserDTO,
        private readonly exceptionRepository: ExceptionRepository) {

        this.user = user;
        const initialize: string[] = [
            this.Check('email').IsEmail(),
            this.Check('password').IsLength({ min: 4, max: 30 }),
            this.Check('firstname').IsString(),
            this.Check('lastname').IsString(),
            this.Check('dni').IsNumber(),
            this.Check('dni').IsLength({ min: 10, max: 10 }),
            this.Check('role').IsRole()
        ];
        const errors = this.validateInput(initialize);
        if (errors.length > 0)  this.exceptionRepository.createException(errors, HttpStatus.BAD_REQUEST);
    }
    private validateInput = (config: string[]) => {
        const errors: string[] = [];
        config.forEach(v => {
            if (v) errors.push(v);
        });
        return errors;
    }
    private Check = (value: string) => {

        const validations: IMethods = {
            IsEmail: () => {
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!(emailRegex.test(this.user[value]))) {
                    return 'Insert a valid email address';
                }
            },
            IsLength: (conditions: { min: number, max: number }) => {
                if (this.user[value].length < conditions.min)
                    return `The minimum ${value} length is ${conditions.min}`;
                if (this.user[value].length > conditions.max)
                    return `The maximum ${value} length is ${conditions.max}`;
            },
            IsString: () => {
                const stringRegex = /^[A-Za-z]+$/;
                if (!stringRegex.test(this.user[value]))
                    return `The ${value} must be just a string`;
            },
            IsNumber: () => {
                const numberRegex = /^[0-9]+$/;
                if(!numberRegex.test(this.user[value]))
                    return 'The DNI must be just numeric';
            },
            IsRole: () => {
                if(!(this.user[value] === 'Customer' || this.user[value] === 'Doctor'))
                return 'Invalid user role';
            }
        
        }
        return validations;
    }
    get get_email(): string {
        return this.user.email;
    }
    get get_password(): string {
        return this.user.password;
    }
    get get_first_name(): string {
        return this.user.firstname;
    }
    get get_last_name(): string {
        return this.user.lastname;
    }
    get get_role(): string {
        return this.user.role;
    }
    get get_dni(): string {
        return this.user.dni;
    }
}