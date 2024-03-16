import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";


class Job {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    logo: string
}
export class CreateJobDto {
    @IsNotEmpty({ message: "Ten khong duoc de trong" })
    name: string;

    @IsString({ each: true, message: "skill định dạng là string" })
    @IsArray({ message: "skill định dạng là array" })
    @IsNotEmpty({ message: "Skills khong duoc de trong" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Job)
    company: Job

    @IsNotEmpty({ message: "Location khong duoc de trong" })
    location: string;

    @IsNotEmpty({ message: "Salary khong duoc de trong" })
    salary: string;

    @IsNotEmpty({ message: "Quantity khong duoc de trong" })
    quantity: string;

    @IsNotEmpty({ message: "Level khong duoc de trong" })
    level: string;

    @IsNotEmpty({ message: "Description khong duoc de trong" })
    description: string;

    @IsNotEmpty({ message: "StartDate khong duoc de trong" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "startDate có định dạng là Date" })
    startDate: Date;

    @IsNotEmpty({ message: "EndDate khong duoc de trong" })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: "EndDate có định dạng là Date" })
    endDate: Date;

    @IsNotEmpty({ message: "isActive khong duoc de trong" })
    @IsBoolean({ message: "isActive có định dạng là boolean" })
    isActive: boolean;
}
