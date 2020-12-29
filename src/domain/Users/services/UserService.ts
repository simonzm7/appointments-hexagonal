import { HttpStatus, Injectable } from '@nestjs/common';
import { timeStamp } from 'console';
import ExceptionRepository from 'src/domain/Exceptions/Repository/ExceptionRepository';
import { User } from 'src/infraestructure/Users/EntityManager/user.entity';
import { UserModel } from '../models/UserModel';
import { abstractUser } from '../repositories/Users/abstractUser';
import { ValidationsRepository } from '../repositories/Validations/ValidationsRepository';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: abstractUser,
    private readonly userValidations: ValidationsRepository,
    private readonly execeptionRepository: ExceptionRepository) { }

  public async Execute(user: UserModel) {

    if (!(await this.userValidations.UserAlreadyExists(user.get_email, user.get_dni)))
      await this.userRepository.createUser(user);

    this.execeptionRepository.createException('User Already Exists', HttpStatus.BAD_REQUEST);
  }

  public async ExecuteBalance(balance: number, userId) {
    const user: User = await this.userRepository.findUserByIdAndReturn(userId);
    if (!user)
      this.execeptionRepository.createException('El usuario no existe', HttpStatus.BAD_REQUEST);

    const balanceError: number = this.userValidations.VerifyBalancaCapacity(Number(balance), Number(user.balance));
    if (balanceError >= 0)
      this.execeptionRepository.createException(`Solo puede ingresar el balance de : ${balanceError}`, HttpStatus.BAD_REQUEST);

    await this.userRepository.updateBalance(balance, user);

  }
}