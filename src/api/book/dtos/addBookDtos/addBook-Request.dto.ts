import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    
    description ?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    image: string
    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    expLength: number;

    @ApiProperty()
    @IsNotEmpty()
    authorId: number;

    @ApiProperty()
    @IsNotEmpty()
    categoryId: number;
}