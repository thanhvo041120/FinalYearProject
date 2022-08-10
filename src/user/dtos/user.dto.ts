import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsDate()
    @Type(()=> Date)
    birthday: Date;

    @IsString()
    @IsNotEmpty()
    phonenumber: string;

    @IsString()
    address: string;
}