import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BorrowDto{
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    SA: string;
}