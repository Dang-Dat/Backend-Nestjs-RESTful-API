import { Type } from "class-transformer"
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator"
import mongoose from "mongoose"

class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId
    @IsNotEmpty()
    name: string
}
//DataTransfer object (dto)
export class CreateUserDto {
    @IsEmail({}, { message: "Email khong dung dinh dang" })
    @IsNotEmpty({ message: "Email khong duoc de trong" })
    email: string

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    password: string

    @IsNotEmpty({ message: "Name khong duoc de trong" })
    name: string
    @IsNotEmpty({ message: "Age khong duoc de trong" })
    age: number
    @IsNotEmpty({ message: "Address khong duoc de trong" })
    address: string
    @IsNotEmpty({ message: "Gender khong duoc de trong" })
    gender: string

    @IsMongoId({ message: "role is a mongo Id" })
    @IsNotEmpty({ message: "Role khong duoc de trong" })
    role: mongoose.Schema.Types.ObjectId;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company

}

export class RegisterUserDto {
    @IsEmail({}, { message: "Email khong dung dinh dang" })
    @IsNotEmpty({ message: "Email khong duoc de trong" })
    email: string

    @IsNotEmpty({ message: "Password khong duoc de trong" })
    password: string

    @IsNotEmpty({ message: "Name khong duoc de trong" })
    name: string
    @IsNotEmpty({ message: "Age khong duoc de trong" })
    age: number
    @IsNotEmpty({ message: "Address khong duoc de trong" })
    address: string
    @IsNotEmpty({ message: "Gender khong duoc de trong" })
    gender: string
}