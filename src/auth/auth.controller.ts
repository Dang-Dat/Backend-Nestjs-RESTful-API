import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customeiz';
import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';


@Controller('auth')//route
export class AuthController {
    constructor(
        private authService: AuthService,
        private roleService: RolesService,
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @ResponseMessage("User Login")
    @Post('/login')
    handleLogin(@User() user: IUser, @Res({ passthrough: true }) response: Response) {

        return this.authService.login(user, response)
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {

        return this.authService.register(registerUserDto)
    }

    @ResponseMessage("Get user information")
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.roleService.findOne(user.role._id) as any
        user.permissions = temp.permissions
        return { user }
    }

    @Public()
    @ResponseMessage("Get user by refresh Token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"]
        return this.authService.processNewToken(refreshToken, response)
    }
    @ResponseMessage("Logout User")
    @Post('/logout')
    Logout(@Res({ passthrough: true }) response: Response, @User() user: IUser) {

        return this.authService.logout(response, user)
    }



}
