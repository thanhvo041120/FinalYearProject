import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendMailRequestDto {
    @IsEmail()
    @IsNotEmpty()
    receiver: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    text: string;
}