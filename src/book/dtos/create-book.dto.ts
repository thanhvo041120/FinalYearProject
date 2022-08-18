import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    description ?: string;

    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsNumber()
    @IsNotEmpty()
    restInStock: number;
}