import { Controller, Post, Body, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import UserLoginManagement from "src/application/UserAuthentication/UsesCases/UserLoginManagement";
import LoginDTO from "src/domain/UserAuthentication/Repository/DTO/LoginDTO";



@Controller('api/auth')
export default class UserAuthenticationController {
    constructor(private readonly authManagment : UserLoginManagement) {}
    @UsePipes(new ValidationPipe({transform : true}))
    @Post()
    async logIn(@Body() credentials : LoginDTO) {
         await this.authManagment.ExecuteLogin(credentials);
    }
}