import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    fullname: string;

    @IsDate()
    @Type(()=> Date)
    birthday: Date;

    @IsString()
    phonenumber: string;

    @IsString()
    address: string;
}