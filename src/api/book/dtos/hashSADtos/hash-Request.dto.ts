import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class HashDto{
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsInt()
    bookId: number;
}