import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class AuthGuard implements CanActivate
{
    canActivate(context: ExecutionContext) : boolean {
        const req = context.switchToHttp().getRequest();
        if(req.headers.userid) return true;
        throw new UnauthorizedException();
    }
}