import { IsString, IsEmail  } from "class-validator";

export class UserDTO {
    @IsEmail()
    email : string;
    @IsString()
    password : string;
    @IsString()
    firstname : string;
    @IsString()
    lastname : string;
    @IsString()
    dni : string;
    @IsString()
    role : string;
}