import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    
    description ?: string;

    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    total: number;

    @ApiProperty()
    @IsNotEmpty()
    authorId: number;

    @ApiProperty()
    @IsNotEmpty()
    categoryId: number;
}