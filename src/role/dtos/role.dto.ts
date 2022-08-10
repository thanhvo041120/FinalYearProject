import { IsNotEmpty, IsString } from "class-validator";

export class RoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;
}