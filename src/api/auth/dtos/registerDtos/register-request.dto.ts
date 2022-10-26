import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty()
    @IsDate()
    @Type(()=>Date)
    birthday: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phonenumber: string;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    roleId: number;
}