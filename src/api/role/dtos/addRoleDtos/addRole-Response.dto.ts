import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateRoleResponseDto{
    message: string;
    affectedRow: number
}