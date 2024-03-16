import { IsEmail, IsNotEmpty, IsString } from "class-validator"


//DataTransfer object (dto)
export class CreateCompanyDto {

    @IsNotEmpty({ message: "Ten khong duoc de trong" })
    name: string

    @IsNotEmpty({ message: "Dia chi khong duoc de trong" })
    address: string

    @IsNotEmpty({ message: "Mo ta khong duoc de trong" })
    description: string

    @IsNotEmpty({ message: "logo khong duoc de trong" })
    logo: string

}
