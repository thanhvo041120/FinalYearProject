import { IsNotEmpty, IsNumber } from "class-validator";

export class GetBooksFilterDto{
    limit?: number;
    page?: number;
    query?: string;
}