import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString  } from "class-validator";

export class HashDto{
    @IsArray()
    @IsNotEmpty()
    address: Array<string>;

    @IsNotEmpty()
    @IsInt()
    bookId: number;

    @IsNotEmpty()
    @IsString()
    bookName: string;

    @IsNumber()
    @IsNotEmpty()
    expLength: number;

}