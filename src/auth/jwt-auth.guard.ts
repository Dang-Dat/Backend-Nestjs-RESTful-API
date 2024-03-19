
import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorator/customeiz';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest()
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token khong hop le ");
        }
        //check permissions
        const targetMethod = request.method;
        const targetEndpoint = request.route?.path as string;

        const permissions = user.permissions ?? [];
        let isExist = permissions.find(permission =>
            targetMethod === permission.method
            &&
            targetEndpoint === permission.apiPath
        )
        if (targetEndpoint.startsWith("/api/v1/auth")) isExist = true;
        if (!isExist) {
            throw new ForbiddenException("Ban khong co quyen de truy cap Endpoint nay")
        }
        return user;
    }
}