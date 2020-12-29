import { Controller, Post, Body, Res, Put, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UserRegisterManagment } from 'src/application/Users/UseCases/UserRegisterManagment';
import { UserDTO } from 'src/domain/Users/repositories/Users/DTO/UserDTO';
import { AuthGuard } from 'src/infraestructure/Appointments/adapters/Guard/AuthGuard';

@Controller('api/user')
export class UserController {

    constructor(private readonly userManagment : UserRegisterManagment){}
    
    @UsePipes(new ValidationPipe({ transform : true }))
    @Post()
    async createUser(@Body() user : UserDTO)
    {
      await this.userManagment.Execute(user);
    }

    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform : true }))
    @Put()
    async updateBalance(@Body() newBalance : any, @Req() req)
    {
       await this.userManagment.ExecuteBalance(newBalance.balance, req.headers.userid);
    }
}