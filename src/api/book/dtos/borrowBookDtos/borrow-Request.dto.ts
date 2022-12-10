import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BorrowDto{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    SA: string;

    @IsString()
    @IsNotEmpty()
    bookName: string;

    @IsDate()
    @Type(()=>Date)
    expDate: Date;
}