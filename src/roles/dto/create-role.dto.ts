import { IsArray, IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import mongoose from "mongoose"

export class CreateRoleDto {
    @IsNotEmpty({ message: "Ten khong duoc de trong" })
    name: string

    @IsNotEmpty({ message: "description khong duoc de trong" })
    description: string

    @IsBoolean({ message: "isActive co gia tri la boolean" })
    @IsNotEmpty({ message: "isActive khong duoc de trong" })
    isActive: boolean

    @IsMongoId({ each: true, message: "each permission la mongo object id" })
    @IsArray({ message: "permissions co dinh dang la array" })
    @IsNotEmpty({ message: "logo khong duoc de trong" })
    permissions: mongoose.Schema.Types.ObjectId[]
}
