import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

export class UpdateUserDto {
    fullname?: string;
    birthday?: Date;
    phonenumber?: string;
    address?: string;
}