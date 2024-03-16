import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { create } from 'domain';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Request, Response } from 'express';
import { error } from 'console';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService,
    ) { }

    //ussername/ pass là 2 tham số thư viện passport nó ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id)
                console.log(temp)
                const objUser = {
                    ...user.toObject(),
                    permissios: temp?.permissions ?? []
                }
                return objUser;
            }
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user
        const payload = {
            sub: "token login",
            iss: "from sever",
            _id,
            name,
            email,
            role

        }
        const refresh_token = this.createRefreshToken({ name: "dat" })

        await this.usersService.updateUserToken(refresh_token, _id)
        //set refresh token as cookies
        response.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        }
    }
    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user)
        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }
    }

    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) / 1000
        }
        )
        return refresh_token
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
            })

            let user = await this.usersService.findUserByToken(refreshToken)
            if (user) {
                const { _id, name, email, role } = user
                const payload = {
                    sub: "token refresh",
                    iss: "from sever",
                    _id,
                    name,
                    email,
                    role

                }
                const refresh_token = this.createRefreshToken({ name: "dat" })

                await this.usersService.updateUserToken(refresh_token, _id.toString())

                //fetch user's role
                const userRole = user.role as unknown as { _id: string; name: string }
                const temp = await this.rolesService.findOne(userRole._id)

                //set refresh token as cookies
                response.clearCookie("refreshToken")
                response.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
                })

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                }
            }
        } catch {
            throw new BadRequestException('Refresh token khong hop le. Vui long login')
        }

    }
    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id)
        response.clearCookie("refreshToken")
        return 'ok'
    }
}
