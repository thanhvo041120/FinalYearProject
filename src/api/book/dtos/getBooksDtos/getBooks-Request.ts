import { IsNotEmpty, IsNumber } from "class-validator";

export class GetBooksFilterDto{
    @IsNotEmpty()
    limit: number;

    @IsNotEmpty()
    page: number;
}