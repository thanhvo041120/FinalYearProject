import { Role } from "src/api/role/role.entity";
import { User } from "src/api/user/entities/user.entity";

export class RegisterResponseDto{
    email: string;
    user: User;
    role: Role;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}