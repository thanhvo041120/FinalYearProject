import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsDate()
    @Type(()=>Date)
    birthday: Date;

    @IsString()
    @IsNotEmpty()
    phonenumber: string;

    @IsString()
    address: string;

}