import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {

    @IsNotEmpty({ message: "name khong duoc de trong" })
    name: string

    @IsEmail({}, { message: "Email khong dung dinh dang" })
    @IsNotEmpty({ message: "Email khong duoc de trong" })
    email: string

    @IsArray({ message: "skills co dinh dang la array" })
    @IsNotEmpty({ message: "Email khong duoc de trong" })
    @IsString({ each: true, message: "skills khong duoc de trong" })
    skills: string[]
}
